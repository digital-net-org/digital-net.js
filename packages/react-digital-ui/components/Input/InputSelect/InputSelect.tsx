import React from 'react';
import { useClassName } from '@digital-net/react-core';
import type { ControlledHandler } from '../../types';
import type { SafariInputNode } from '../types';
import { useInputRef } from '../useInputRef';
import { InputBox } from '../InputBox';
import './InputSelect.styles.css';

export interface InputSelectProps<T = any> extends SafariInputNode {
    value: T | undefined;
    options: Array<T>;
    onAccess?: (value: T) => string;
    onRender: (value: T | undefined) => React.ReactNode;
    onChange: ControlledHandler<T | undefined>;
    onSelect?: ControlledHandler<T>;
    onBlur?: ControlledHandler<T>;
}

export function InputSelect<T>({
    className,
    name,
    label,
    onAccess,
    onRender,
    onChange,
    ...props
}: InputSelectProps<T>) {
    const ref = useInputRef<HTMLSelectElement>(props);
    const resolvedClassName = useClassName(props, 'DigitalUi-InputSelect');

    const options = React.useMemo(
        () => [...props.options, ...(!props.required ? [undefined] : [])],
        [props.options, props.required]
    );

    const handleAccess = (value: T | undefined): string => (value ? (onAccess?.(value) ?? String(value)) : 'null');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (props.loading) {
            return;
        }
        const resolved = props.options.find(opt => (onAccess?.(opt) ?? opt) === e.currentTarget.value);
        onChange(resolved);
    };

    return (
        <InputBox id={props.id} className={className} label={label} {...props}>
            <div className={resolvedClassName}>
                <label>
                    <select
                        ref={ref}
                        value={handleAccess(props.value)}
                        onChange={handleChange}
                        name={name}
                        disabled={props.disabled || props.loading}
                    >
                        {options.map(option => (
                            <option key={handleAccess(option)} value={handleAccess(option)}>
                                {onRender(option)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </InputBox>
    );
}
