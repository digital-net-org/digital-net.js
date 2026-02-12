import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Story } from '../modules/Story';

export class Default extends Story {
    public title = 'dn-input-text';
    public category = 'Inputs';

    private static defaultLabel = 'Label';
    private static defaultHint = "I don't know what it does... But I figure you might wanna know something about it.";
    private static defaultPlaceholder = 'Placeholder';

    private static defaultProps = [
        { label: Default.defaultLabel, hint: Default.defaultHint },
        { disabled: true, label: Default.defaultLabel, hint: Default.defaultHint },
        {},
        { value: 'Some value', disabled: true, loading: true },
        { label: Default.defaultLabel, hint: Default.defaultHint, max: 100 },
    ];

    private renderDefault() {
        return html`
            <style>
                .input-text-story {
                    border: dashed 1px #5a4a0f5f;
                    border-radius: 5px;
                    padding: 1rem;
                    min-height: 145px;
                    gap: 3rem;
                    & pre {
                        flex: 2;
                    }
                    & dn-input-text {
                        flex: 1;
                    }
                }
            </style>
            <h2 class="dn-story-title">Default</h2>
            <div class="flex-column">
                ${Default.defaultProps.map(props => {
                    return html`
                        <div class="flex-row input-text-story">
                            <dn-input-text
                                value=${ifDefined(props.value)}
                                label=${props.label}
                                hint=${props.hint}
                                ?disabled=${props.disabled}
                                ?loading=${props.loading}
                                max=${ifDefined(props.max)}
                            ></dn-input-text>
                            <pre class="dn-story-json">${Story.toJson(props)}</pre>
                        </div>
                    `;
                })}
            </div>
            <hr />
            <h2 class="dn-story-title">Password</h2>
            <div class="flex-row input-text-story">
                <div>
                    <dn-input-text type="password" label="Password"></dn-input-text>
                </div>
            </div>
        `;
    }

    public render() {
        return html`
            <div class="dn-stories">
                <div class="dn-story">${this.renderDefault()}</div>
            </div>
        `;
    }
}
