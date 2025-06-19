import React from 'react';

export function useEditorDialogState() {
    const [isReloadPopupOpen, setIsReloadPopupOpen] = React.useState(false);
    const toggleReloadPopup = React.useCallback(() => setIsReloadPopupOpen(prev => !prev), []);

    return {
        isReloadPopupOpen,
        toggleReloadPopup,
    };
}
