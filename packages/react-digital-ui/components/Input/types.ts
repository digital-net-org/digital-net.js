import type { SafariNode } from '../types';

export type InputCustomError = 'GENERIC_ERROR' | 'MIME_TYPE';

export interface BaseInputProps {
    required?: boolean | undefined;
    requiredMessage?: string;
    loading?: boolean | undefined;
    name?: string;
    disabled?: boolean | undefined;
}

export interface InputBoxProps extends BaseInputProps {
    fullWidth?: boolean | undefined;
    borderless?: boolean | undefined;
    error?: boolean | undefined;
    selected?: boolean | undefined;
    help?: string | undefined;
    label?: string;
    characterCount?: [number, number] | undefined;
}

export type SafariInputNode = BaseInputProps & InputBoxProps & SafariNode;
