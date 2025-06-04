import React from 'react';

export function useChildren(children: React.ReactNode) {
    const getTypeOf = React.useCallback(
        (type: React.ElementType, id?: string | null) =>
            React.Children.toArray(children).find(
                c =>
                    React.isValidElement<{ id?: string | undefined }>(c) &&
                    c.type === type &&
                    (id === undefined || id === null || (id && c.props.id === id))
            ),
        [children]
    );

    const mapTypeOf = React.useCallback(
        (type: React.ElementType, id?: string | null, props?: Record<string, any>) => {
            const child = getTypeOf(type, id);
            if (!React.isValidElement(child)) return null;
            return React.cloneElement(child, props);
        },
        [getTypeOf]
    );

    return { getTypeOf, mapTypeOf };
}
