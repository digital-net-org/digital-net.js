import * as React from 'react';
import { CustomRenderContext, type DnCustomViewDict } from './useCustomNode';

export function CustomRenderProvider({
    customRender = {},
    children,
}: {
    children: React.ReactNode;
    customRender?: DnCustomViewDict;
}) {
    return <CustomRenderContext.Provider value={customRender}>{children}</CustomRenderContext.Provider>;
}
