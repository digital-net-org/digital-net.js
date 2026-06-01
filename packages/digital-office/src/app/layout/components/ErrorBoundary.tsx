import * as React from 'react';
import { NotFoundException } from '../../exceptions';
import { ErrorView } from './ErrorView';
import { NotFoundView } from './NotFoundView';

interface ErrorBoundaryState {
    error: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
    public state: ErrorBoundaryState = { error: null };

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    public render() {
        const { error } = this.state;
        if (error) {
            if (error instanceof NotFoundException) return <NotFoundView />;
            return <ErrorView error={error} />;
        }
        return this.props.children;
    }
}
