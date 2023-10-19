import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  color: 'var(--affine-text-primary-color)',
  height: '62px',
  width: '100%',
  alignItems: 'stretch',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: 'var(--affine-hover-color)',
  },
  overflow: 'hidden',
  cursor: 'default',
  selectors: {
    'a&': {
      cursor: 'pointer',
    },
  },
});

export const selectionCell = style({
  paddingLeft: '4px',
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  minWidth: '16px',
});

export const titleCell = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0 16px',
  maxWidth: 'calc(100% - 64px)',
  flex: 1,
  whiteSpace: 'nowrap',
});

export const titleCellMain = style({
  overflow: 'hidden',
  fontSize: 'var(--affine-font-sm)',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  flex: 1,
  textOverflow: 'ellipsis',
  alignSelf: 'stretch',
});

export const titleCellPreview = style({
  overflow: 'hidden',
  color: 'var(--affine-text-secondary-color)',
  fontSize: 'var(--affine-font-xs)',
  flex: 1,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  alignSelf: 'stretch',
  selectors: {
    '&:not(:empty)': {
      marginTop: '4px',
    },
  },
});

export const iconCell = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: 'var(--affine-font-h-3)',
  color: 'var(--affine-icon-color)',
  flexShrink: 0,
});

export const tagsCell = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: 'var(--affine-font-xs)',
  color: 'var(--affine-text-secondary-color)',
  padding: '0 8px',
  height: '60px',
  width: '100%',
});

export const dateCell = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: 'var(--affine-font-xs)',
  color: 'var(--affine-text-secondary-color)',
  flexShrink: 0,
  flexWrap: 'nowrap',
  padding: '0 8px',
});

export const actionsCellWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0,
  columnGap: '6px',
  paddingRight: '16px',
});

export const operationsCell = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0,
});