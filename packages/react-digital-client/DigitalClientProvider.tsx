import React, { type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { DigitalReactClient } from './DigitalReactClient';

export default function DigitalClientProvider(props: PropsWithChildren) {
    return <QueryClientProvider client={DigitalReactClient.queryClient} {...props} />;
}
