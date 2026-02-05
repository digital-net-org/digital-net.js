import { html } from 'lit';
import { Story } from '../modules/Story';

export class Default extends Story {
    public title = 'dn-input-switch';
    public category = 'Inputs';

    public render() {
        return html`
            <div>
                <dn-input-switch .value="${true}"></dn-input-switch>
            </div>
        `;
    }
}
