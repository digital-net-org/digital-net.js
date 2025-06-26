import {
    type Patch,
    type PageMeta,
    type DigitalCrudEndpoint,
    type Page,
    ObjectMatcher,
    StringIdentity,
    EntityHelper,
    type StoredPatchOperation,
} from '@digital-net/core';
import { digitalClientInstance } from '@digital-net/react-digital-client';
import { EditorHelper } from '../editor/EditorHelper';

export class EditorApiHelper {
    public static apiUrl: DigitalCrudEndpoint = 'page';
    public static readonly store = 'pages';

    public static invalidateGetAll() {
        digitalClientInstance.invalidate(this.apiUrl);
    }

    public static invalidateGetById(id: string) {
        digitalClientInstance.invalidate(`${EditorApiHelper.apiUrl}/${id}`);
    }

    public static handleCreate(): Partial<Page> {
        const title = StringIdentity.generate();
        return {
            title,
            puckData: JSON.stringify(EditorHelper.defaultData),
            path: '/' + title,
        };
    }

    public static handlePagePatch(
        localEntity: Page | undefined,
        entity: Page,
        metas: Array<StoredPatchOperation<PageMeta>>
    ): Patch {
        const payload = Object.keys(localEntity ?? {}).reduce<Partial<Page>>((acc, key) => {
            if (key === 'puckData') {
                acc[key] = localEntity?.puckData;
            } else if (
                key !== 'id' &&
                key !== 'createdAt' &&
                key !== 'updatedAt' &&
                !ObjectMatcher.deepEquality(localEntity?.[key], entity[key])
            ) {
                acc[key] = localEntity?.[key];
            }
            return acc;
        }, {});
        if (payload?.path && !/^\/.*/.test(payload.path)) {
            payload.path = '/' + payload.path;
        }
        return [
            ...EntityHelper.buildPatch<Page>(payload),
            ...metas.map(({ path, op, value }) => ({
                path,
                op,
                ...(op === 'remove'
                    ? { value: undefined }
                    : {
                          value: {
                              content: value.content,
                              key: value.key,
                              value: value.value,
                          },
                      }),
            })),
        ];
    }
}
