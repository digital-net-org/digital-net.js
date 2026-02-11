import { html } from 'lit';
import { Story } from '../modules/Story';
import type { Size } from '../../src';

export class Default extends Story {
    public title = 'dn-avatar';
    public category = 'Icons';

    private static imgSample =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
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
                                    <dn-avatar size="${size}"></dn-avatar>
                                    <dn-avatar src="http://localhost:3000/nothing-here" size="${size}"></dn-avatar>
                                    <dn-avatar src=${Default.imgSample} size="${size}"></dn-avatar>
                                </div>
                            </div>
                        `
                    )}
                </div>
            </div>
        `;
    }

    private renderFullWidth() {
        return html`
            <style>
                .full-width-icon-stories {
                    height: 500px;
                    width: 500px;
                    border: 1px solid var(--primary-color);
                    box-sizing: content-box;
                    padding: 1rem;
                }
                .full-width-icon-story {
                    overflow: hidden;
                    width: 200px;
                    height: 200px;
                    max-width: 500px;
                    max-height: 500px;
                    min-width: 64px;
                    min-height: 64px;
                    border: var(--border-color) 1px dashed;
                    padding: 0.5rem;
                    resize: both;
                }
            </style>
            <div class="flex-column">
                <h2 class="dn-story-title">Full Width</h2>
                <h3 class="dn-story-subtitle">Icon</h3>
                <div class="full-width-icon-stories">
                    <div class="full-width-icon-story">
                        <dn-avatar full-width></dn-avatar>
                    </div>
                </div>
                <h3 class="dn-story-subtitle">Image</h3>
                <div class="full-width-icon-stories">
                    <div class="full-width-icon-story">
                        <dn-avatar full-width src=${Default.imgSample}></dn-avatar>
                    </div>
                </div>
            </div>
        `;
    }

    public render() {
        return html`
            <div class="dn-stories">
                <div class="dn-story">
                    <div class="flex-row">${this.renderDefault()}</div>
                    <hr />
                    <div class="flex-row">${this.renderFullWidth()}</div>
                </div>
            </div>
        `;
    }
}
