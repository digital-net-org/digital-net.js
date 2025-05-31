import type { Page } from '@digital-net/core';
import { useStoredEntity } from '../../../../Storage';
import { usePageUrlState } from './usePageUrlState';
import { PageEditorHelper } from './PageEditorHelper';

export function usePageStore() {
    const { currentPage: currentFrame } = usePageUrlState();
    return useStoredEntity<Page>(PageEditorHelper.store, currentFrame);
}
