import type { Page } from '@digital-net/core';
import { useIDbStore } from '../../../Storage';
import { EditorApiHelper } from './EditorApiHelper';

export function usePageStore() {
    return useIDbStore<Page>(EditorApiHelper.store);
}
