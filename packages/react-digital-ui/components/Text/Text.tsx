import React from 'react';
import { Property, useClassName } from '../../../core';
import type { SafariNode } from '../types';
import './Text.styles.css';
import { Box } from '@digital-net/react-digital-ui';

export interface TextProps extends SafariNode {
    children: any;
    disabled?: boolean;
    bold?: boolean;
    light?: boolean;
    italic?: boolean;
    variant?: 'h1' | 'h2' | 'h3' | 'text' | 'span' | 'caption' | 'JSON' | 'section-title';
    size?: 'xsmall' | 'small' | 'regular' | 'medium' | 'large' | 'xlarge';
}

export function Text({ children, ...props }: TextProps) {
    const className = useClassName(props, 'DigitalUi-Text');

    const tag = React.useMemo(() => {
        if (props.variant === 'text' || props.variant === undefined) {
            return 'p';
        }
        if (props.variant === 'caption' || props.variant === 'span') {
            return 'span';
        }
        return props.variant;
    }, [props.variant]);

    if (props.variant === 'JSON') {
        return (
            <pre className={className}>{children === undefined ? 'undefined' : JSON.stringify(children, null, 2)}</pre>
        );
    }

    if (props.variant === 'section-title') {
        return (
            <Box className={className}>
                <Box fullWidth>{children}</Box>
                <hr />
            </Box>
        );
    }

    return React.createElement(tag, { ...Property.toHtml(props), className }, children);
}
