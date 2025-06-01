import type { DigitalCrudEndpoint } from '@digital-net/core';
import { DigitalReactClient } from '@digital-net/react-digital-client';

export class PageEditorHelper {
    public static apiUrl: DigitalCrudEndpoint = 'page';
    public static store = 'pages';
    public static className = 'Page-Editor';

    public static invalidateGetAll() {
        DigitalReactClient.invalidate(this.apiUrl);
    }

    public static invalidateGetById(id: string) {
        DigitalReactClient.invalidate(`${PageEditorHelper.apiUrl}/${id}`);
    }
}
