import type { PageEntityType } from '../../../../Dto';

export interface PageBuildPayload {
    path: string;
    pageType?: PageEntityType;
    pageSlug?: string;
}
