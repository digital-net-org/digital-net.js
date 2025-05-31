import { DigitalReactClient } from '@digital-net/react-digital-client';

export class FrameConfigApi {
    public static api = `${DIGITAL_API_URL}/frame/config`;
    public static testApi = `${this.api}/test`;

    public static InvalidateApi() {
        for (const api of [this.api, this.testApi]) {
            DigitalReactClient.invalidate(api);
        }
    }
}
