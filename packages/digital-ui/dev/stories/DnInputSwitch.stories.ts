import { html } from 'lit';
import { Story } from '../modules/Story';

export class Default extends Story {
    public title = 'dn-input-switch';
    public category = 'Inputs';

    public onRender = (template: HTMLElement) => {
        const defaultSwitch = template.querySelector('#default');
        this.defaultState.switchValue = (defaultSwitch as any)?.value;
        const defaultJson = template.querySelector('#default-json');
        defaultJson!.innerHTML = Story.toJson(this.defaultState);
    };

    private defaultState = {
        defaultValue: true,
        switchValue: true,
        lastEventOrigin: 'None',
    };

    private renderDefault() {
        return html`
            <div class="flex-column">
                <dn-input-switch
                    id="default"
                    @change=${(e: Event) => {
                        const value = (e.target as any).value;
                        console.log('Switch value changed:', value);
                        this.defaultState.switchValue = value;
                        this.defaultState.lastEventOrigin = (e.target as HTMLElement).tagName;
                        this.requestUpdate();
                    }}
                    .value=${this.defaultState.switchValue}
                ></dn-input-switch>
                <hr />
                <button
                    class="dn-story-btn"
                    @click=${(e: Event) => {
                        const value = !this.defaultState.switchValue;
                        console.log('Switch value changed:', value);
                        this.defaultState.switchValue = value;
                        this.defaultState.lastEventOrigin = (e.target as HTMLElement).tagName;
                        this.requestUpdate();
                    }}
                >
                    Update value
                </button>
            </div>
            <pre id="default-json" class="dn-story-json"></pre>
        `;
    }

    public render() {
        return html`
            <div class="dn-stories">
                <div class="dn-story">
                    <h2 class="dn-story-title">Default</h2>
                    <div class="flex-row">${this.renderDefault()}</div>
                </div>
            </div>
        `;
    }
}
