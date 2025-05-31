import React from 'react';
import { useClassName, useOnClickOutside } from '@digital-net/core';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { Text } from '../Text';
import type { SafariNodeWithChildren } from '../types';
import './Toast.styles.css';

export interface ToastProps extends SafariNodeWithChildren {
    variant?: 'info' | 'error' | 'success';
    hidden?: boolean;
    onClose?: () => void;
}

export const animationDuration = 1000;

export function Toast({ id, children, onClose, ...props }: ToastProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const className = useClassName(props, 'DigitalUi-Toast');
    const [internalHiddenState, setInternalHiddenState] = React.useState(Boolean(props.hidden));

    useOnClickOutside(ref, () => onClose?.());

    React.useEffect(() => {
        const value = Boolean(props.hidden);
        const timeoutId = setTimeout(() => setInternalHiddenState(value), value ? animationDuration : 0);
        return () => clearTimeout(timeoutId);
    }, [props.hidden]);

    return !internalHiddenState ? (
        <div id={id} ref={ref} className={className}>
            <Box direction="row" gap={2} align="center">
                {props.variant === 'success' && <Icon.CheckBoxIcon variant="outlined" />}
                {props.variant === 'error' && <Icon.WarnBoxIcon variant="outlined" />}
                <Text variant="text" light>
                    {children}
                </Text>
            </Box>
        </div>
    ) : null;
}
