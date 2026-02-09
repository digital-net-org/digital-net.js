import type React from 'react';

export interface CreateReactAppOptions {
    strictMode?: boolean;
    render: () => React.ReactNode;
}
