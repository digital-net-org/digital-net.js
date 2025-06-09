import type { DigitalCrudEndpoint } from '@digital-net/core';
import { digitalClientInstance } from '@digital-net/react-digital-client';

export class EditorApiHelper {
    public static apiUrl: DigitalCrudEndpoint = 'page';
    public static store = 'pages';

    public static invalidateGetAll() {
        digitalClientInstance.invalidate(this.apiUrl);
    }

    public static invalidateGetById(id: string) {
        digitalClientInstance.invalidate(`${EditorApiHelper.apiUrl}/${id}`);
    }
}
