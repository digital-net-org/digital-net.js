import React from 'react';
import { useClassName, useProps } from '@digital-net/react-core';
import type { ControlledState, SafariNode } from '../../types';
import type { BaseInputProps } from '../types';
import './InputSwitch.styles.css';

export interface InputSwitchProps extends BaseInputProps, SafariNode, ControlledState<boolean> {
    name?: string;
}

export function InputSwitch({ id, value, onChange, ...props }: InputSwitchProps) {
    const className = useClassName(props, 'DigitalUi-InputSwitch');
    const { mapHtmlProps } = useProps(props);

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (props.disabled || props.loading) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const handleChange = (_: React.ChangeEvent<HTMLInputElement>) => {
        onChange(!value);
    };

    return (
        <div id={id} className={className}>
            <label className="DigitalUi-InputSwitch-label" htmlFor={props.name}>
                {mapHtmlProps(
                    <input
                        id={props.name}
                        className="DigitalUi-InputSwitch-input"
                        name={props.name}
                        value="true"
                        type="checkbox"
                        checked={value}
                        onClick={handleClick}
                        onChange={handleChange}
                    />
                )}
                <span className="DigitalUi-InputSwitch-slider"></span>
            </label>
        </div>
    );
}
