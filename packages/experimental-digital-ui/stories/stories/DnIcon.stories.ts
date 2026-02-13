import { html } from 'lit';
import { Story } from '../modules/Story';
import type { IconKey, Size, Direction } from '../../src';

export class Default extends Story {
    public title = 'dn-icon';
    public category = 'Icons';

    private static icons: IconKey[] = [
        'circle',
        'account-circle',
        'account-filled',
        'account-outlined',
        'account-add-filled',
        'account-add-outlined',
        'account-remove-filled',
        'account-remove-outlined',
        'account-check-filled',
        'account-check-outlined',
        'account-gear-filled',
        'account-gear-outlined',
        'account-lock-filled',
        'account-lock-outlined',
        'arrow-round-filled',
        'arrow-round-outlined',
        'arrow-square-filled',
        'arrow-square-outlined',
        'envelope-filled',
        'envelope-outlined',
        'gear-filled',
        'gear-outlined',
    ];

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
                                    ${Default.icons.map(
                                        icon => html` <dn-icon name="${icon}" size="${size}"></dn-icon> `
                                    )}
                                </div>
                            </div>
                        `
                    )}
                </div>
            </div>
        `;
    }

    private renderVariants() {
        return html`
            <style>
                .icon-stories {
                    align-items: start;
                    gap: 2rem;
                }
                .icon-story {
                    border: var(--border-color) 1px dashed;
                    border-radius: 5px;
                    padding: 0.5rem 1rem;
                    height: 100%;
                    justify-content: start;
                    align-items: center;
                }
                .icon-story pre {
                    color: var(--primary-color);
                }
                .colorized-icon-story dn-icon {
                    --dn-icon-color: red;
                }
                .cursor-pointer-icon-story dn-icon {
                    --dn-icon-cursor: pointer;
                }
            </style>
            <div class="flex-column">
                <h2 class="dn-story-title">Variants</h2>
                <div class="icon-stories flex-row">
                    <div class="icon-story colorized-icon-story flex-column">
                        <div>
                            <h3 class="dn-story-subtitle">Colorized</h3>
                            <pre>--dn-icon-color: red;</pre>
                        </div>
                        <dn-icon name="account-circle" size="x-large"></dn-icon>
                    </div>
                    <div class="icon-story cursor-pointer-icon-story flex-column">
                        <div>
                            <h3 class="dn-story-subtitle">Colorized</h3>
                            <pre>--dn-icon-cursor: pointer;</pre>
                        </div>
                        <dn-icon name="account-circle" size="x-large"></dn-icon>
                    </div>
                </div>
            </div>
        `;
    }

    private static directions: Direction[] = ['up', 'down', 'left', 'right'];

    public renderDirections() {
        return html`
            <div class="flex-column">
                <h2 class="dn-story-title">Directions</h2>
                <div class="flex-row">
                    ${Default.directions.map(
                        direction => html`
                            <div class="flex-column">
                                <h3 class="dn-story-subtitle">${direction}</h3>
                                <dn-icon name="arrow-round-filled" direction="${direction}"></dn-icon>
                                <dn-icon name="account-circle"></dn-icon>
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
                <div class="full-width-icon-stories">
                    <div class="full-width-icon-story">
                        <dn-icon name="account-circle" full-width></dn-icon>
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
                    <div class="flex-row">${this.renderVariants()}</div>
                    <hr />
                    <div class="flex-row">${this.renderDirections()}</div>
                    <hr />
                    <div class="flex-row">${this.renderFullWidth()}</div>
                </div>
            </div>
        `;
    }
}
