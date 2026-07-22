import { createCommand } from 'lexical';

// `nodeKey` targets an existing node (from the context menu); `undefined` derives from the selection.
export const OPEN_LINK_DIALOG_COMMAND = createCommand<{ nodeKey: string } | undefined>('OPEN_LINK_DIALOG_COMMAND');
