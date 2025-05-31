import { DigitalReactClient } from '@digital-net/react-digital-client';

export class FrameEditorHelper {
    public static store = 'frame';
    public static apiUrl = `${DIGITAL_API_URL}/${this.store}`;
    public static className = 'Frame-Editor';

    public static invalidateGetAll() {
        DigitalReactClient.invalidate(FrameEditorHelper.apiUrl);
    }

    public static invalidateGetById(id: string) {
        DigitalReactClient.invalidate(`${FrameEditorHelper.apiUrl}/${id}`);
    }
}
