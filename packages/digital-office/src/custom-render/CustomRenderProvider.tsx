import * as React from 'react';
import type { DnEntityName } from '../entity';

export type DnCustomView = 'edit:tab:general:before' | 'edit:tab:general:after';
export type DnCustomViewDict = Partial<Record<DnEntityName, Partial<Record<DnCustomView, React.ReactNode>>>>;

const CustomRenderContext = React.createContext<DnCustomViewDict>({});

export function CustomRenderProvider({
    customRender = {},
    children,
}: {
    children: React.ReactNode;
    customRender?: DnCustomViewDict;
}) {
    return <CustomRenderContext.Provider value={customRender}>{children}</CustomRenderContext.Provider>;
}

export function useCustomNode() {
    const dict = React.useContext(CustomRenderContext);
    const renderCustomNode = React.useCallback(
        ({ entity, view }: { entity: DnEntityName; view: DnCustomView }) => dict[entity]?.[view],
        [dict]
    );
    return {
        dict,
        renderCustomNode,
    };
}
