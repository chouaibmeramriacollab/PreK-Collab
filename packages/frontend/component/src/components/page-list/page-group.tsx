import type { Tag } from '@affine/env/filter';
import { Trans } from '@affine/i18n';
import { assertExists } from '@blocksuite/global/utils';
import { EdgelessIcon, PageIcon, ToggleCollapseIcon } from '@blocksuite/icons';
import type { PageMeta, Workspace } from '@blocksuite/store';
import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { isEqual } from 'lodash-es';
import { type MouseEventHandler, useCallback, useState } from 'react';

import { PagePreview } from './page-content-preview';
import * as styles from './page-group.css';
import { PageListItem } from './page-list-item';
import { pageListPropsAtom, selectionStateAtom } from './scoped-atoms';
import type {
  PageGroupDefinition,
  PageGroupProps,
  PageListItemProps,
  PageListProps,
} from './types';
import { type DateKey } from './types';
import { betweenDaysAgo, withinDaysAgo } from './utils';

// todo: optimize date matchers
const getDateGroupDefinitions = (key: DateKey): PageGroupDefinition[] => [
  {
    id: 'today',
    label: <Trans i18nKey="com.affine.today" />,
    match: item => withinDaysAgo(new Date(item[key] ?? item.createDate), 1),
  },
  {
    id: 'yesterday',
    label: <Trans i18nKey="com.affine.yesterday" />,
    match: item => betweenDaysAgo(new Date(item[key] ?? item.createDate), 1, 2),
  },
  {
    id: 'last7Days',
    label: <Trans i18nKey="com.affine.last7Days" />,
    match: item => betweenDaysAgo(new Date(item[key] ?? item.createDate), 2, 7),
  },
  {
    id: 'last30Days',
    label: <Trans i18nKey="com.affine.last30Days" />,
    match: item =>
      betweenDaysAgo(new Date(item[key] ?? item.createDate), 7, 30),
  },
  {
    id: 'moreThan30Days',
    label: <Trans i18nKey="com.affine.moreThan30Days" />,
    match: item => !withinDaysAgo(new Date(item[key] ?? item.createDate), 30),
  },
];

const pageGroupDefinitions = {
  createDate: getDateGroupDefinitions('createDate'),
  updatedDate: getDateGroupDefinitions('updatedDate'),
  // add more here later
};

export function pagesToPageGroups(
  pages: PageMeta[],
  key?: DateKey
): PageGroupProps[] {
  if (!key) {
    return [
      {
        id: 'all',
        items: pages,
        allItems: pages,
      },
    ];
  }

  // assume pages are already sorted, we will use the page order to determine the group order
  const groupDefs = pageGroupDefinitions[key];
  const groups: PageGroupProps[] = [];

  for (const page of pages) {
    // for a single page, there could be multiple groups that it belongs to
    const matchedGroups = groupDefs.filter(def => def.match(page));
    for (const groupDef of matchedGroups) {
      const group = groups.find(g => g.id === groupDef.id);
      if (group) {
        group.items.push(page);
      } else {
        const label =
          typeof groupDef.label === 'function'
            ? groupDef.label()
            : groupDef.label;
        groups.push({
          id: groupDef.id,
          label: label,
          items: [page],
          allItems: pages,
        });
      }
    }
  }
  return groups;
}

export const PageGroup = ({ id, items, label }: PageGroupProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const onExpandedClicked: MouseEventHandler = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    setCollapsed(v => !v);
  }, []);
  return (
    <div
      data-testid="page-list-group"
      data-group-id={id}
      className={styles.root}
    >
      {label ? (
        <div data-testid="page-list-group-header" className={styles.header}>
          <div
            role="button"
            onClick={onExpandedClicked}
            data-testid="page-list-group-header-collapsed-button"
            className={styles.collapsedIconContainer}
          >
            <ToggleCollapseIcon
              className={styles.collapsedIcon}
              data-collapsed={collapsed !== false}
            />
          </div>
          <div className={styles.headerLabel}>{label}</div>
          <div className={styles.headerCount}>{items.length}</div>
        </div>
      ) : null}
      {collapsed
        ? null
        : items.map(item => (
            <PageMetaListItemRenderer key={item.id} {...item} />
          ))}
    </div>
  );
};

// todo: optimize how to render page meta list item
const requiredPropNames = [
  'blockSuiteWorkspace',
  'renderPageAsLink',
  'onOpenPage',
  'isPreferredEdgeless',
  'pageOperationsRenderer',
  'selectedPageIds',
  'onSelectedPageIdsChange',
  'draggable',
  'onDragStart',
  'onDragEnd',
] as const;

type RequiredProps = Pick<PageListProps, (typeof requiredPropNames)[number]> & {
  selectable: boolean;
};

const listPropsAtom = selectAtom(
  pageListPropsAtom,
  props => {
    return Object.fromEntries(
      requiredPropNames.map(name => [name, props[name]])
    ) as RequiredProps;
  },
  isEqual
);

const PageMetaListItemRenderer = (pageMeta: PageMeta) => {
  const props = useAtomValue(listPropsAtom);
  const { selectionActive } = useAtomValue(selectionStateAtom);
  return (
    <PageListItem
      {...pageMetaToPageItemProp(pageMeta, {
        ...props,
        selectable: !!selectionActive,
      })}
    />
  );
};

function tagIdToTagOption(
  tagId: string,
  blockSuiteWorkspace: Workspace
): Tag | undefined {
  return blockSuiteWorkspace.meta.properties.tags?.options.find(
    opt => opt.id === tagId
  );
}

function pageMetaToPageItemProp(
  pageMeta: PageMeta,
  props: RequiredProps
): PageListItemProps {
  const itemProps: PageListItemProps = {
    pageId: pageMeta.id,
    title: pageMeta.title,
    preview: (
      <PagePreview workspace={props.blockSuiteWorkspace} pageId={pageMeta.id} />
    ),
    createDate: new Date(pageMeta.createDate),
    updatedDate: pageMeta.updatedDate
      ? new Date(pageMeta.updatedDate)
      : undefined,
    to: props.renderPageAsLink
      ? `/workspace/${props.blockSuiteWorkspace.id}/${pageMeta.id}`
      : undefined,
    onClickPage: props.onOpenPage
      ? newTab => {
          props.onOpenPage?.(pageMeta.id, newTab);
        }
      : undefined,
    icon: props.isPreferredEdgeless?.(pageMeta.id) ? (
      <EdgelessIcon />
    ) : (
      <PageIcon />
    ),
    tags:
      pageMeta.tags
        ?.map(id => tagIdToTagOption(id, props.blockSuiteWorkspace))
        .filter((v): v is Tag => v != null) ?? [],
    operations: props.pageOperationsRenderer?.(pageMeta),
    selectable: props.selectable,
    selected: props.selectedPageIds?.includes(pageMeta.id),
    onSelectedChange: props.onSelectedPageIdsChange
      ? selected => {
          assertExists(props.selectedPageIds);
          const prevSelected = props.selectedPageIds.includes(pageMeta.id);
          const shouldAdd = selected && !prevSelected;
          const shouldRemove = !selected && prevSelected;

          if (shouldAdd) {
            props.onSelectedPageIdsChange?.([
              ...props.selectedPageIds,
              pageMeta.id,
            ]);
          } else if (shouldRemove) {
            props.onSelectedPageIdsChange?.(
              props.selectedPageIds.filter(id => id !== pageMeta.id)
            );
          }
        }
      : undefined,
    draggable: props.draggable,
    isPublicPage: !!pageMeta.isPublic,
    onDragStart: props.onDragStart
      ? () => props.onDragStart?.(pageMeta.id)
      : undefined,
    onDragEnd: props.onDragEnd
      ? () => props.onDragEnd?.(pageMeta.id)
      : undefined,
  };
  return itemProps;
}
