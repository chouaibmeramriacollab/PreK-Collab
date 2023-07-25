import './page-detail-editor.css';

import { PageNotFoundError } from '@affine/env/constant';
import { rootBlockHubAtom } from '@affine/workspace/atom';
import type { EditorContainer } from '@blocksuite/editor';
import { assertExists } from '@blocksuite/global/utils';
import type { Page, Workspace } from '@blocksuite/store';
import { useBlockSuitePageMeta } from '@toeverything/hooks/use-block-suite-page-meta';
import { useBlockSuiteWorkspacePage } from '@toeverything/hooks/use-block-suite-workspace-page';
import type { CallbackMap } from '@toeverything/plugin-infra/entry';
import {
  affinePluginsAtom,
  contentLayoutAtom,
  editorItemsAtom,
  rootStore,
  windowItemsAtom,
} from '@toeverything/plugin-infra/manager';
import type { AffinePlugin, LayoutNode } from '@toeverything/plugin-infra/type';
import clsx from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';
import type { CSSProperties, FC, ReactElement } from 'react';
import { memo, Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { pageSettingFamily } from '../atoms';
import { fontStyleOptions, useAppSetting } from '../atoms/settings';
import { BlockSuiteEditor as Editor } from './blocksuite/block-suite-editor';
import TrashButtonGroup from './blocksuite/workspace-header/header-right-items/trash-button-group';
import * as styles from './page-detail-editor.css';
import { pluginContainer } from './page-detail-editor.css';

export type PageDetailEditorProps = {
  isPublic?: boolean;
  workspace: Workspace;
  pageId: string;
  onInit: (page: Page, editor: Readonly<EditorContainer>) => void;
  onLoad?: (page: Page, editor: EditorContainer) => () => void;
};

const EditorWrapper = memo(function EditorWrapper({
  workspace,
  pageId,
  onInit,
  onLoad,
  isPublic,
}: PageDetailEditorProps) {
  const page = useBlockSuiteWorkspacePage(workspace, pageId);
  if (!page) {
    throw new PageNotFoundError(workspace, pageId);
  }
  const meta = useBlockSuitePageMeta(workspace).find(
    meta => meta.id === pageId
  );
  const pageSettingAtom = pageSettingFamily(pageId);
  const pageSetting = useAtomValue(pageSettingAtom);
  const currentMode = pageSetting?.mode ?? 'page';

  const setBlockHub = useSetAtom(rootBlockHubAtom);
  const [appSettings] = useAppSetting();

  assertExists(meta);
  const value = useMemo(() => {
    const fontStyle = fontStyleOptions.find(
      option => option.key === appSettings.fontStyle
    );
    assertExists(fontStyle);
    return fontStyle.value;
  }, [appSettings.fontStyle]);

  return (
    <>
      <Editor
        className={clsx(styles.editor, {
          'full-screen': appSettings.fullWidthLayout,
        })}
        style={
          {
            '--affine-font-family': value,
          } as CSSProperties
        }
        key={`${workspace.id}-${pageId}`}
        mode={isPublic ? 'page' : currentMode}
        page={page}
        onInit={useCallback(
          (page: Page, editor: Readonly<EditorContainer>) => {
            onInit(page, editor);
          },
          [onInit]
        )}
        setBlockHub={setBlockHub}
        onLoad={useCallback(
          (page: Page, editor: EditorContainer) => {
            page.workspace.setPageMeta(page.id, {
              updatedDate: Date.now(),
            });
            localStorage.setItem('last_page_id', page.id);
            let dispose = () => {};
            if (onLoad) {
              dispose = onLoad(page, editor);
            }
            const editorItems = rootStore.get(editorItemsAtom);
            let disposes: (() => void)[] = [];
            const renderTimeout = setTimeout(() => {
              disposes = Object.entries(editorItems).map(([id, editorItem]) => {
                const div = document.createElement('div');
                div.setAttribute('plugin-id', id);
                const cleanup = editorItem(div, editor);
                assertExists(parent);
                document.body.appendChild(div);
                return () => {
                  cleanup();
                  document.body.removeChild(div);
                };
              });
            });

            return () => {
              dispose();
              clearTimeout(renderTimeout);
              setTimeout(() => {
                disposes.forEach(dispose => dispose());
              });
            };
          },
          [onLoad]
        )}
      />
      {meta.trash && <TrashButtonGroup />}
    </>
  );
});

const PluginContentAdapter = memo<{
  windowItem: CallbackMap['window'];
}>(function PluginContentAdapter({ windowItem }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }
    let cleanup: () => void = () => {};
    let childDiv: HTMLDivElement | null = null;
    const renderTimeout = setTimeout(() => {
      const div = document.createElement('div');
      cleanup = windowItem(div);
      root.appendChild(div);
      childDiv = div;
    });

    return () => {
      clearTimeout(renderTimeout);
      setTimeout(() => {
        cleanup();
        if (childDiv) {
          root.removeChild(childDiv);
        }
      });
    };
  }, [windowItem]);
  return <div className={pluginContainer} ref={ref} />;
});

type LayoutPanelProps = {
  node: LayoutNode;
  editorProps: PageDetailEditorProps;
  plugins: AffinePlugin<string>[];
};

const LayoutPanel = memo(function LayoutPanel(
  props: LayoutPanelProps
): ReactElement {
  const node = props.node;
  const windowItems = useAtomValue(windowItemsAtom);
  if (typeof node === 'string') {
    if (node === 'editor') {
      return <EditorWrapper {...props.editorProps} />;
    } else {
      const windowItem = windowItems[node];
      return <PluginContentAdapter windowItem={windowItem} />;
    }
  } else {
    return (
      <PanelGroup
        style={{
          height: 'calc(100% - 52px)',
        }}
        direction={node.direction}
      >
        <Panel defaultSize={node.splitPercentage}>
          <Suspense>
            <LayoutPanel
              node={node.first}
              editorProps={props.editorProps}
              plugins={props.plugins}
            />
          </Suspense>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={100 - node.splitPercentage}>
          <Suspense>
            <LayoutPanel
              node={node.second}
              editorProps={props.editorProps}
              plugins={props.plugins}
            />
          </Suspense>
        </Panel>
      </PanelGroup>
    );
  }
});

export const PageDetailEditor: FC<PageDetailEditorProps> = props => {
  const { workspace, pageId } = props;
  const page = useBlockSuiteWorkspacePage(workspace, pageId);
  if (!page) {
    throw new PageNotFoundError(workspace, pageId);
  }

  const layout = useAtomValue(contentLayoutAtom);
  const affinePluginsMap = useAtomValue(affinePluginsAtom);
  const plugins = useMemo(
    () => Object.values(affinePluginsMap),
    [affinePluginsMap]
  );

  return (
    <>
      <Suspense>
        <LayoutPanel node={layout} editorProps={props} plugins={plugins} />
      </Suspense>
    </>
  );
};
