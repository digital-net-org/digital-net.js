import React from 'react';
import { StringResolver, useClassName } from '@digital-net/core';
import { Localization } from '@digital-net/react-app/Localization';
import type { ControlledHandler } from '../../types';
import { IconButton } from '../../Button';
import { Box } from '../../Box';
import { Text } from '../../Text';
import { Loader } from '../../Loader';
import { InputBox } from '../InputBox';
import type { InputCustomError, SafariInputNode } from '../types';
import type { MimeType } from './types';
import './InputFile.styles.css';

export interface InputFileProps extends SafariInputNode {
    value: Array<File> | undefined;
    onChange: ControlledHandler<Array<File> | undefined>;
    accept?: Array<MimeType>;
    multiple?: boolean;
}

const baseClassName = 'DigitalUi-InputFile';

export function InputFile({ className, name, label, value, onChange, ...props }: InputFileProps) {
    const resolvedClassName = useClassName(props, baseClassName);
    const [error, setError] = React.useState<InputCustomError>();
    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (!ref.current) {
            return;
        }
        const data = new DataTransfer();
        if (!value) {
            ref.current.files = data.files;
            return;
        }
        for (const file of value) {
            data.items.add(file);
        }
        ref.current.files = data.files;
    }, [value]);

    React.useEffect(
        () => (error && error !== 'GENERIC_ERROR' ? ref.current?.setCustomValidity(error) : void 0),
        [error]
    );

    const resolvedFileName = React.useMemo(() => {
        const name = value?.[0]?.name;
        if (!name) {
            return Localization.translate('ui-input:file.empty');
        }
        return StringResolver.truncateWithEllipsis(name, 28);
    }, [value]);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (props.loading || props.disabled) {
            return;
        }
        if (ref.current) {
            ref.current.click();
        }
    };

    const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        onChange(undefined);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.loading || props.disabled) {
            return;
        }

        const resolved: Array<File> = [];
        for (const file of e.target.files ?? []) {
            if (props.accept && !props.accept.includes(file.type as MimeType)) {
                setError('MIME_TYPE');
            } else {
                setError(undefined);
            }
            resolved.push(file);
        }
        onChange(resolved.length > 0 ? resolved : undefined);
        return resolved;
    };

    return (
        <InputBox
            id={props.id}
            className={baseClassName + className ? ` ${className}` : ''}
            label={label}
            error={props.disabled ? false : Boolean(error)}
            {...props}
        >
            <div className={resolvedClassName}>
                <label className={`${baseClassName}-label`} htmlFor={name} onClick={handleClick}>
                    <Text size="small">{resolvedFileName}</Text>
                </label>
                <input
                    className={`${baseClassName}-input`}
                    ref={ref}
                    type="file"
                    name={name}
                    disabled={props.disabled || props.loading}
                    multiple={props.multiple}
                    required={props.required}
                    accept={props.accept?.join(',')}
                    onChange={handleChange}
                    onError={() => setError('GENERIC_ERROR')}
                    onInvalid={() => setError('GENERIC_ERROR')}
                />
                {props.loading ? (
                    <Loader size="small" />
                ) : (
                    <Box direction="row" align="center" gap={1}>
                        {(value?.length ?? 0) > 0 ? (
                            <IconButton
                                variant="icon-filled"
                                icon="CloseIcon"
                                onClick={handleDelete}
                                type="button"
                                critical
                            />
                        ) : null}
                        <IconButton variant="icon-filled" icon="AddFileIcon" onClick={handleClick} type="button" />
                    </Box>
                )}
            </div>
        </InputBox>
    );
}
