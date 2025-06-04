import React from 'react';

export function useFirstRender(callback?: () => void) {
    const firstRender = React.useRef(true);
    React.useEffect(() => (firstRender.current ? callback?.() : void 0), [callback]);
    React.useEffect(() => {
        firstRender.current = false;
    }, []);
    return firstRender.current;
}
