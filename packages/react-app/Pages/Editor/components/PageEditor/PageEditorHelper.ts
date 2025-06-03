import type { DigitalCrudEndpoint } from '@digital-net/core';
import { digitalClientInstance } from '@digital-net/react-digital-client';

export class PageEditorHelper {
    public static apiUrl: DigitalCrudEndpoint = 'page';
    public static store = 'pages';
    public static className = 'Page-Editor';

    public static invalidateGetAll() {
        digitalClientInstance.invalidate(this.apiUrl);
    }

    public static invalidateGetById(id: string) {
        digitalClientInstance.invalidate(`${PageEditorHelper.apiUrl}/${id}`);
    }
}
