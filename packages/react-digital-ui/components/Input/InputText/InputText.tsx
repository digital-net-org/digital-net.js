import React from 'react';
import { useClassName } from '@digital-net/react-core';
import { Icon } from '../../Icon';
import { type ControlledState } from '../../types';
import { InputBox } from '../InputBox';
import { type SafariInputNode } from '../types';
import { useInputPattern, type InputPatternProps } from '../useInputPattern';
import { useInputRef } from '../useInputRef';
import './InputText.styles.css';

export interface InputTextProps extends SafariInputNode, InputPatternProps, ControlledState<string | undefined> {
    onSelect?: () => void;
    onBlur?: () => void;
    type?: 'text' | 'password' | 'email';
    disableAdornment?: boolean;
    focusOnMount?: boolean;
}

export function InputText({
    type = 'text',
    pattern,
    name,
    label,
    disableAdornment,
    focusOnMount,
    ...props
}: InputTextProps) {
    const className = useClassName(props, 'DigitalUi-InputText');
    const [selected, setSelected] = React.useState(false);
    const [hidden, setHidden] = React.useState(type === 'password');
    const ref = useInputRef<HTMLInputElement>(props);

    const { handleChange, handleError, handleInvalid, error } = useInputPattern({ ...props, pattern });

    React.useLayoutEffect(() => (focusOnMount ? ref.current?.focus() : void 0), [focusOnMount, ref]);

    const resolvedType = React.useMemo(() => {
        if (type !== 'password') {
            return type;
        }
        if (props.disabled) {
            return 'password';
        }
        return hidden ? 'password' : 'text';
    }, [hidden, props.disabled, type]);

    const handleSelect = () => {
        props.onSelect?.();
        setSelected(true);
    };

    const handleBlur = () => {
        props.onBlur?.();
        setSelected(false);
    };

    const handleHidden = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setHidden(!hidden);
    };

    return (
        <InputBox id={props.id} label={label} error={props.disabled ? false : error} selected={selected} {...props}>
            <div className={className}>
                <input
                    ref={ref}
                    value={props.value}
                    name={name}
                    pattern={pattern}
                    required={props.required}
                    disabled={props.disabled}
                    type={resolvedType}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    onBlur={handleBlur}
                    onError={handleError}
                    onInvalid={handleInvalid}
                />
                {type === 'password' && !disableAdornment && (
                    <button onClick={handleHidden} type="button" disabled={props.disabled}>
                        {hidden ? <Icon.EyeSlashedIcon variant="filled" /> : <Icon.EyeIcon variant="filled" />}
                    </button>
                )}
            </div>
        </InputBox>
    );
}
