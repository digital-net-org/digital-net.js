import React from 'react';
import { useClassName } from '@digital-net/react-core';
// TODO: Should not import from react-app, replace with a prop
import { Localization } from '../../../react-app/Localization';
import { type SafariNode } from '../types';
import { type BoxProps, Box } from '../Box';
import type { InputCustomError } from '../Input/types';

export interface FormProps extends SafariNode, Omit<BoxProps, 'onSubmit'> {
    label?: string;
    onSubmit?: (e: React.FormEvent) => void;
}

const getInputs = (ref: React.RefObject<HTMLFormElement | null>) => ref.current?.getElementsByTagName('input');

export function Form({ children, className: propsClassName = 'DigitalUi-Form', id, onSubmit, ...boxProps }: FormProps) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const className = useClassName({}, propsClassName);

    const handleError = () => {
        const inputs = getInputs(formRef);
        for (let i = 0; i < (inputs?.length ?? 0); i++) {
            const input = inputs?.[i] as HTMLInputElement & { validationMessage: InputCustomError };
            let errorKey: string | undefined;

            if (!input || input.validity.valid) {
                continue;
            }
            if (input.validity.valueMissing) {
                errorKey = 'required';
            }
            if (input.validity.patternMismatch) {
                errorKey = 'pattern';
            }
            if (input.validity.customError && input.validationMessage === 'MIME_TYPE') {
                errorKey = 'mimeType';
            }
            if (errorKey) {
                input.setCustomValidity(Localization.translate(`ui-form:validity.${errorKey}`));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <Box
            element="form"
            ref={formRef}
            id={id}
            className={className}
            onSubmit={handleSubmit}
            onInvalid={handleError}
            {...boxProps}
        >
            {children}
        </Box>
    );
}
