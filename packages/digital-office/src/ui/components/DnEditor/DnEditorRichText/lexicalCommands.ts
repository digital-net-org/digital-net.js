import { createCommand } from 'lexical';
import type { DnEditorRichTextImageAttrs } from './types';

// `nodeKey` targets an existing node (from the context menu); `undefined` derives from the selection.
export const OPEN_LINK_DIALOG_COMMAND = createCommand<{ nodeKey: string } | undefined>('OPEN_LINK_DIALOG_COMMAND');
export const OPEN_IMAGE_DIALOG_COMMAND = createCommand<{ nodeKey: string } | undefined>('OPEN_IMAGE_DIALOG_COMMAND');
export const INSERT_IMAGE_COMMAND = createCommand<DnEditorRichTextImageAttrs>('INSERT_IMAGE_COMMAND');
