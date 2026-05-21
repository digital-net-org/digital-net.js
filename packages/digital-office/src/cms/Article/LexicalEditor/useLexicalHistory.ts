import * as React from 'react';
import { type LexicalEditor, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, REDO_COMMAND, UNDO_COMMAND } from 'lexical';
import { mergeRegister } from '@lexical/utils';

export function useLexicalHistory(editor: LexicalEditor) {
    const [canUndo, setCanUndo] = React.useState(false);
    const [canRedo, setCanRedo] = React.useState(false);

    React.useEffect(
        () =>
            mergeRegister(
                editor.registerCommand(
                    CAN_UNDO_COMMAND,
                    payload => {
                        setCanUndo(payload);
                        return false;
                    },
                    1
                ),
                editor.registerCommand(
                    CAN_REDO_COMMAND,
                    payload => {
                        setCanRedo(payload);
                        return false;
                    },
                    1
                )
            ),
        [editor]
    );

    const undo = React.useCallback(() => editor.dispatchCommand(REDO_COMMAND, undefined), [editor]);
    const redo = React.useCallback(() => editor.dispatchCommand(UNDO_COMMAND, undefined), [editor]);

    return {
        canUndo,
        canRedo,
        undo,
        redo,
    };
}
