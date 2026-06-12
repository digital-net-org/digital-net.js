import type { MutationSignal } from '@digital-net-org/digital-api-sdk';
import type { Query } from '@tanstack/react-query';
import { DN_QUERY_KEY_GET, DN_QUERY_KEY_LIST } from '../../entity';

/** Subset of react-query `InvalidateQueryFilters` we produce (prefix key match, or a predicate). */
export interface InvalidationFilter {
    queryKey?: readonly unknown[];
    predicate?: (query: Query) => boolean;
}

interface EntityCacheMapping {
    listPath: string;
    getName: string;
}

// Backend EntityType (CLR name, case-insensitive here) → office cache locations.
const ENTITY_CACHE_MAP: Record<string, EntityCacheMapping> = {
    article: { listPath: 'cms/articles', getName: 'article' },
    page: { listPath: 'cms/pages', getName: 'page' },
    media: { listPath: 'cms/media', getName: 'media' },
    tag: { listPath: 'cms/tags', getName: 'tag' },
    form: { listPath: 'cms/forms', getName: 'form' },
};

export function resolveInvalidations(signal: MutationSignal, currentUserId?: string): InvalidationFilter[] {
    const entity = signal.entity.toLowerCase();
    const mapping = ENTITY_CACHE_MAP[entity];
    if (mapping) {
        return [
            { queryKey: [DN_QUERY_KEY_LIST, mapping.listPath] },
            { queryKey: [DN_QUERY_KEY_GET, mapping.getName, signal.entityId] },
        ];
    }

    switch (entity) {
        // The signal carries the FIELD id, not the form's: the parent-touch emits the matching
        // `Form` signal for the detail view, only the list needs a nudge here.
        case 'formfield':
            return [{ queryKey: [DN_QUERY_KEY_LIST, 'cms/forms'] }];
        case 'formsubmission':
            return [
                { queryKey: [DN_QUERY_KEY_GET, 'formSubmission', signal.entityId] },
                {
                    predicate: query =>
                        query.queryKey[0] === DN_QUERY_KEY_GET &&
                        query.queryKey[1] === 'form' &&
                        query.queryKey.includes('submissions'),
                },
            ];
        // Received only when the stream credential belongs to an admin (restricted entity).
        case 'user': {
            const filters: InvalidationFilter[] = [{ queryKey: [DN_QUERY_KEY_GET, '/admin/user', signal.entityId] }];
            if (currentUserId && signal.entityId === currentUserId) {
                filters.push({ queryKey: ['dn-user', 'self'] });
            }
            return filters;
        }
        // Convention: every config query key starts with 'config-value'.
        case 'configvalue':
            return [{ queryKey: ['config-value'] }];

        default:
            return [];
    }
}
