import React, { type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { digitalClientInstance } from './digitalClientInstance';

export default function DigitalClientProvider(props: PropsWithChildren) {
    return <QueryClientProvider client={digitalClientInstance.queryClient} {...props} />;
}
