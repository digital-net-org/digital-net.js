import React from "react";
import type {Config} from "@measured/puck";

interface PuckContextState {
    config: Config
}

export const PuckContext = React.createContext<PuckContextState>({
    config: { components: {} }
});

export function PuckProvider({ children, config }: React.PropsWithChildren<PuckContextState>) {
    return (
        <PuckContext.Provider value={{ config }}>
            {children}
        </PuckContext.Provider>
    );
}
