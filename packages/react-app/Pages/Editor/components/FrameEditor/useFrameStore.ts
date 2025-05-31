import type { Page } from '@digital-net/core';
import { useStoredEntity } from '../../../../Storage';
import { useFrameUrlState } from './useFrameUrlState';
import { FrameEditorHelper } from './FrameEditorHelper';

export function useFrameStore() {
    const { currentFrame } = useFrameUrlState();
    return useStoredEntity<Page>(FrameEditorHelper.store, currentFrame);
}
