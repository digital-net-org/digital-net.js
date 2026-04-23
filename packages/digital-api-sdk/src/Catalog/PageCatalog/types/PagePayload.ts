import type { PageEntityType } from '../../../types';

export interface PagePayload {
    path: string;
    entityType?: PageEntityType;
}
