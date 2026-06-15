import * as React from 'react';

export function lazyView<K extends string>(loader: () => Promise<Record<K, React.ComponentType>>, key: K) {
    // React.lazy needs `default` exports
    return React.lazy(async () => ({ default: (await loader())[key] }));
}
