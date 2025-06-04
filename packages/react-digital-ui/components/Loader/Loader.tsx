import React from 'react';
import type { SafariNodeWithChildren } from '../types';
import { useClassName } from '@digital-net/react-core';
import './Loader.styles.css';

type BaseLoaderProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & SafariNodeWithChildren;

export interface LoaderProps extends BaseLoaderProps {
    color?: 'primary' | 'text' | 'disabled';
    size?: 'small' | 'medium' | 'large';
}

export function Loader({ color = 'text', size = 'medium', ...props }: LoaderProps) {
    const className = useClassName({ ...props, color, size }, 'DigitalUi-Loader');
    return (
        <div className={className}>
            {Array(4)
                .fill(null)
                .map((_, i) => (
                    <div key={i} />
                ))}
        </div>
    );
}
