import React from 'react';

export function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T | null>, callback: () => void) {
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) =>
            ref.current && !ref.current.contains(event.target as Node) ? callback() : void 0;

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref, callback]);
}
