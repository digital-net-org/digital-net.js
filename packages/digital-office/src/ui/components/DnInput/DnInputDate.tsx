import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { DnInput, type DnInputProps } from './DnInput';

export interface DnInputDateProps extends Omit<
    DnInputProps,
    'type' | 'multiline' | 'rows' | 'minRows' | 'maxRows' | 'max' | 'pattern'
> {
    type?: 'date' | 'datetime-local' | 'time';
}

export function DnInputDate({ type = 'date', value, defaultValue, onChange, onBlur, ...props }: DnInputDateProps) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = React.useState(true);

    React.useEffect(() => {
        const input = wrapperRef.current?.querySelector('input');
        setIsEmpty(!input?.value);
    }, [value, defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsEmpty(event.target.value === '');
        onChange?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsEmpty(event.target.value === '');
        onBlur?.(event);
    };

    return (
        <DateWrapper ref={wrapperRef} data-empty={isEmpty}>
            <DnInput
                {...props}
                value={value}
                defaultValue={defaultValue}
                type={type}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </DateWrapper>
    );
}

const DateWrapper = styled('div')(
    ({ theme }) => css`
        width: 100%;

        & .MuiInputBase-input {
            color-scheme: ${theme.palette.mode};
        }

        & .MuiInputBase-input::-webkit-calendar-picker-indicator {
            cursor: pointer;
        }

        & .MuiInputBase-input {
            transition: color 100ms ease-in-out;
        }

        &[data-empty='true'] .MuiInputBase-input:not(:focus) {
            color: transparent;
        }
    `
);
