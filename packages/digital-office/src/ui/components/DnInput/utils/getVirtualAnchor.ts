/**
 * Build a virtual Rect for a popover absolute position resolution
 */
export function getVirtualAnchor(position: { top: number; left: number }): Element {
    return {
        getBoundingClientRect: () =>
            ({
                width: 0,
                height: 0,
                top: position.top,
                left: position.left,
                right: position.left,
                bottom: position.top,
                x: position.left,
                y: position.top,
                toJSON: () => undefined,
            }) as DOMRect,
        nodeType: 1,
    } as unknown as Element;
}
