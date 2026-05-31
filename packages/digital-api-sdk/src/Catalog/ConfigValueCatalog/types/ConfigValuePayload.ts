import type { ConfigValueType } from '../../../types';

export interface ConfigValuePayload {
    name: string;
    value?: string | null;
    type?: ConfigValueType;
}
