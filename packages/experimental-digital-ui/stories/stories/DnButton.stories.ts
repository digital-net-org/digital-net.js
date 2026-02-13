import { html } from 'lit';
import { Story } from '../modules/Story';
import type { DnButton } from '../../src';

export class Default extends Story {
    public title = 'dn-button';
    public category = 'Inputs';

    private static variants: DnButton['variant'][] = ['default', 'outlined', 'text'];
    private static defaultChildren = 'I do nothing';

    private renderDefault() {
        return html`
            <style>
                pre {
                    color: var(--primary-color);
                }
                .button-stories {
                    flex-wrap: nowrap;
                }
                .button-story {
                    min-height: 150px;
                }
            </style>
            <div class="flex-column">
                <h2 class="dn-story-title">Default</h2>
                <div class="flex-row button-stories">
                    ${Default.variants.map(
                        variant => html`
                            <div class="flex-column">
                                <h3 class="dn-story-subtitle">${variant} variant</h3>
                                <div class="flex-column">
                                    <div class="button-story">
                                        <pre>${`<dn-button variant="${variant}">`}</pre>
                                        <dn-button variant="${variant}">${Default.defaultChildren}</dn-button>
                                    </div>
                                    <div class="button-story">
                                        <pre>${`<dn-button active variant="${variant}">`}</pre>
                                        <dn-button active variant="${variant}">${Default.defaultChildren}</dn-button>
                                    </div>
                                    <div class="button-story">
                                        <pre>${`<dn-button disabled variant="${variant}">`}</pre>
                                        <dn-button disabled variant="${variant}">${Default.defaultChildren}</dn-button>
                                    </div>
                                    <div class="button-story">
                                        <pre>${`<dn-button disabled loading variant="${variant}">`}</pre>
                                        <dn-button disabled loading variant="${variant}">
                                            ${Default.defaultChildren}
                                        </dn-button>
                                    </div>
                                    <div class="button-story">
                                        <pre>${`<dn-button loading variant="${variant}">`}</pre>
                                        <dn-button loading variant="${variant}">${Default.defaultChildren}</dn-button>
                                    </div>
                                    <div class="button-story">
                                        <pre>${`<dn-button critical variant="${variant}">`}</pre>
                                        <dn-button critical variant="${variant}">${Default.defaultChildren}</dn-button>
                                    </div>
                                    <div class="button-story">
                                        <pre>${`<dn-button icon="account-circle" variant="${variant}">`}</pre>
                                        <dn-button icon="account-circle" variant="${variant}"
                                            >${Default.defaultChildren}</dn-button
                                        >
                                    </div>
                                    <div class="button-story">
                                        <pre>${`<dn-button critical icon="account-circle" variant="${variant}">`}</pre>
                                        <dn-button critical icon="account-circle" variant="${variant}"
                                            >${Default.defaultChildren}</dn-button
                                        >
                                    </div>
                                    <div class="button-story">
                                        <pre>${`<dn-button active icon="account-circle" variant="${variant}">`}</pre>
                                        <dn-button active icon="account-circle" variant="${variant}"
                                            >${Default.defaultChildren}</dn-button
                                        >
                                    </div>
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
