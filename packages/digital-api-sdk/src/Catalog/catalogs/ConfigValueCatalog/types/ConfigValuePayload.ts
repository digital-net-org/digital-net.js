import type { ConfigValueType } from '../../../../Dto';

export interface ConfigValuePayload {
    name: string;
    value?: string | null;
    type?: ConfigValueType;
}
