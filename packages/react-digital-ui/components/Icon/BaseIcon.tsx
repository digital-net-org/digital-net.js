import type React from 'react';
import { useClassName, useProps } from '@digital-net/react-core';
import type { SafariNode } from '../types';
import './Icon.styles.css';

export interface IconProps extends SafariNode {
    color?: 'primary' | 'text' | 'disabled';
    variant?: 'outlined' | 'filled';
    size?: 'x-small' | 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    direction?: 'up' | 'down' | 'left' | 'right';
    animation?: boolean;
}

export default function BaseIcon({
    variant = 'filled',
    color = 'text',
    size = 'small',
    direction = 'up',
    animation = true,
    ...props
}: IconProps & { children: React.ReactNode }) {
    const className = useClassName({ ...props, variant, color, size, direction, animation }, 'DigitalUi-Icon');
    const resolved = useProps({ ...props, variant, color, size, direction, animation, className });
    return resolved.mapHtmlProps();
}
