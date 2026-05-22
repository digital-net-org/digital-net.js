import * as React from 'react';
import type { DnEntityName } from '../entity';

export type DnCustomView = 'edit:tab:general:before' | 'edit:tab:general:after';

export interface DnCustomRenderArgs {
    entity: DnEntityName;
    view: DnCustomView;
}

export type DnCustomRenderFn = (_args: DnCustomRenderArgs) => React.ReactNode;

interface DnCustomRenderContextValue {
    onCustomRender: DnCustomRenderFn | null;
}

const DnCustomRenderContext = React.createContext<DnCustomRenderContextValue>({
    onCustomRender: null,
});

export interface DnCustomRenderProviderProps {
    onCustomRender?: DnCustomRenderFn;
    children: React.ReactNode;
}

export function DnCustomRenderProvider({ onCustomRender, children }: DnCustomRenderProviderProps) {
    const fnRef = React.useRef<DnCustomRenderFn | null>(onCustomRender ?? null);
    React.useEffect(() => {
        fnRef.current = onCustomRender ?? null;
    }, [onCustomRender]);

    const isCallbackSet = React.useMemo(() => Boolean(onCustomRender), [onCustomRender]);
    const value = React.useMemo<DnCustomRenderContextValue>(
        () => ({
            onCustomRender: isCallbackSet ? args => fnRef.current?.(args) ?? null : null,
        }),
        // Only re-create the context value when the presence of the callback flips,
        // not when its identity changes — fnRef gives consumers a stable function.
        [isCallbackSet]
    );

    return <DnCustomRenderContext.Provider value={value}>{children}</DnCustomRenderContext.Provider>;
}

export function useCustomNode() {
    const { onCustomRender } = React.useContext(DnCustomRenderContext);
    return React.useMemo(
        () => ({
            renderCustomNode: (args: DnCustomRenderArgs): React.ReactNode =>
                onCustomRender ? (onCustomRender(args) ?? null) : null,
        }),
        [onCustomRender]
    );
}
