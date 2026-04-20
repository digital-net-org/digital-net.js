import * as React from 'react';
import { ErrorView } from './ErrorView';
import { NotFoundException } from './NotFoundException';
import { NotFoundView } from './NotFoundView';

export interface DnErrorBoundaryProps {
    children?: React.ReactNode;
}

interface DnErrorBoundaryState {
    error: Error | null;
}

export class DnErrorBoundary extends React.Component<DnErrorBoundaryProps, DnErrorBoundaryState> {
    public state: DnErrorBoundaryState = { error: null };

    public static getDerivedStateFromError(error: Error): DnErrorBoundaryState {
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
