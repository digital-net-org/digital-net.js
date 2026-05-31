import type { ConfigValueType } from './ConfigValueType';
import type { Entity } from './Entity';

export interface ConfigValueDto extends Entity {
    name: string;
    value?: string | null;
    type: ConfigValueType;
}
