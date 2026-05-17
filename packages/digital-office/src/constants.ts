import type { IDbConfig } from './storage';

export const DN_DRAFT_STORES = ['pages', 'tags', 'media', 'articles'] as const;
export type DnDraftStoreName = (typeof DN_DRAFT_STORES)[number];

export const DRAFTS_DB_CONFIG: IDbConfig = {
    name: 'office-drafts',
    version: 4,
    stores: DN_DRAFT_STORES.map(name => `patch:${name}`),
};
