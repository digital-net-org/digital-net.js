import React from 'react';
import { useClassName, useProps } from '@digital-net/react-core';
import { Loader } from '../Loader';
import './Button.styles.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
    variant?: 'primary' | 'secondary' | 'text' | 'icon' | 'icon-filled' | 'icon-bordered';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    selected?: boolean;
    critical?: boolean;
    href?: string;
    align?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(({ children, variant = 'primary', ...props }, ref) => {
    const className = useClassName({ ...props, variant }, 'DigitalUi-Button');
    const { mapHtmlProps } = useProps({ ...props, variant, className });

    return mapHtmlProps(
        React.createElement(props.href ? 'a' : 'button', {
            ref,
            children: (
                <React.Fragment>
                    {props.loading && <Loader color={props.disabled ? 'disabled' : 'text'} size="small" />}
                    <span className="DigitalUi-Button-content">{children}</span>
                </React.Fragment>
            ),
        })
    );
});
