import * as React from 'react';

export interface ContextMenuPosition {
    top: number;
    left: number;
}

export interface ContextMenuHandle {
    position: ContextMenuPosition | null;
    openAt: (_event: Pick<MouseEvent, 'clientX' | 'clientY' | 'preventDefault'>) => void;
    close: () => void;
}

// Tracks the anchor position of a right-click menu. Accepts a native or React mouse event
// (structural typing) so it works both from a DOM listener and an onContextMenu prop.
export function useContextMenu(): ContextMenuHandle {
    const [position, setPosition] = React.useState<ContextMenuPosition | null>(null);

    const openAt = React.useCallback((event: Pick<MouseEvent, 'clientX' | 'clientY' | 'preventDefault'>) => {
        event.preventDefault();
        setPosition({ top: event.clientY, left: event.clientX });
    }, []);

    const close = React.useCallback(() => setPosition(null), []);

    return { position, openAt, close };
}
