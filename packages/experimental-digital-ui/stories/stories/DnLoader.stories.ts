import { html } from 'lit';
import { Story } from '../modules/Story';
import type { Size } from '../../src';

export class Default extends Story {
    public title = 'dn-loader';
    public category = 'Loaders';

    private static sizes: Size[] = ['x-small', 'small', 'medium', 'large', 'x-large'];

    private renderDefault() {
        return html`
            <div class="flex-column">
                <h2 class="dn-story-title">Default</h2>
                <div class="flex-column">
                    ${Default.sizes.map(
                        size => html`
                            <div class="flex-column">
                                <h3 class="dn-story-subtitle">${size}</h3>
                                <div class="flex-row">
                                    <dn-loader size="${size}"></dn-loader>
                                </div>
                            </div>
                        `
                    )}
                </div>
            </div>
        `;
    }

    public render() {
        return html`
            <div class="dn-stories">
                <div class="dn-story">
                    <div class="flex-row">${this.renderDefault()}</div>
                </div>
            </div>
        `;
    }
}
