import * as React from 'react';

const DEFAULT_DEBOUNCE_MS = 500;

export interface UseArticleAutocompleteResult {
    inputValue: string;
    search: string;
    onInputChange: (_event: unknown, _next: string) => void;
}

export function useArticleAutocomplete(debounceMs: number = DEFAULT_DEBOUNCE_MS): UseArticleAutocompleteResult {
    const [inputValue, setInputValue] = React.useState('');
    const [search, setSearch] = React.useState('');
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => () => (debounceRef.current ? clearTimeout(debounceRef.current) : void 0), []);

    const onInputChange = React.useCallback(
        (_event: unknown, next: string) => {
            setInputValue(next);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => setSearch(next.trim()), debounceMs);
        },
        [debounceMs]
    );

    return { inputValue, search, onInputChange };
}
