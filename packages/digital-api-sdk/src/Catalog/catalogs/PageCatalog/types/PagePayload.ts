import type { PageEntityType } from '../../../../Dto';

export interface PagePayload {
    path: string;
    entityType?: PageEntityType;
}
