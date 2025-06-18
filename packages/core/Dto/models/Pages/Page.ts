import type { PageLight } from './PageLight';

export interface Page extends PageLight {
    puckData: string;
    description: string;
    isIndexed: boolean;
}
