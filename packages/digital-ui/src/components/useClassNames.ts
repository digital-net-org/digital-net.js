import React from 'react';

/**
 * Resolves a record of class names to a single string based on their boolean values.
 * @param classes - A record where keys are class names and values determine inclusion.
 * @param deps - Dependency list controlling memoization, similar to `React.useMemo`.
 * @returns A space-separated string of the enabled class names.
 */
export function useClassNames(classes: Record<string, boolean | undefined>, deps: React.DependencyList) {
    return React.useMemo(
        () =>
            Object.entries(classes)
                .filter(([_, value]) => value)
                .map(([key]) => key)
                .join(' '),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps
    );
}
