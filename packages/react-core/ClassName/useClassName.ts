import React from 'react';
import { ClassName } from '@digital-net/core';

export function useClassName(props: Record<string, any>, name: string) {
    return React.useMemo(() => ClassName.resolveProps(name ?? 'Component', props), [name, props]);
}
