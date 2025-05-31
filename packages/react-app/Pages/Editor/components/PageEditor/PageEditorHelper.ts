import { digitalEndpoints } from '@digital-net/core';
import { DigitalReactClient } from '@digital-net/react-digital-client';

export class PageEditorHelper {
    public static apiUrl = digitalEndpoints['page'];
    public static store = 'pages';
    public static className = 'Page-Editor';

    public static invalidateGetAll() {
        DigitalReactClient.invalidate(PageEditorHelper.apiUrl);
    }

    public static invalidateGetById(id: string) {
        DigitalReactClient.invalidate(`${PageEditorHelper.apiUrl}/${id}`);
    }
}
