import type { IDbConfig } from './storage';

export const DN_DRAFT_STORES = ['pages', 'tags'] as const;
export type DnDraftStoreName = (typeof DN_DRAFT_STORES)[number];

export const DRAFTS_DB_CONFIG: IDbConfig = {
    name: 'office-drafts',
    // Bumped from 1 to 2 to trigger `onupgradeneeded` and create the `patch:tags` store
    // for existing users (cf. IDbAccessor.initDatabase).
    version: 2,
    stores: DN_DRAFT_STORES.map(name => `patch:${name}`),
};
