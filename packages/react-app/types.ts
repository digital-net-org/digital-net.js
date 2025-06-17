import type { Config } from '@measured/puck';
import type { RouterProps } from './Router';

export interface DigitalConfig {
    strictMode?: boolean;
    router?: RouterProps['router'];
    puckConfig: Config;
}
