import { html } from 'lit';
import { Story } from '../modules/Story';

export class Default extends Story {
    public title = 'dn-input-switch';
    public category = 'Inputs';

    // ###################################
    // Default Story
    // ###################################
    public onRender = (template: HTMLElement) => {
        const defaultSwitch = template.querySelector('#default');
        this.defaultState.switchValue = (defaultSwitch as any)?.value;
        const defaultJson = template.querySelector('#default-json');
        defaultJson!.innerHTML = Story.toJson(this.defaultState);

        const formJson = template.querySelector('#form-json');
        formJson!.innerHTML = Story.toJson(this.formState);
    };

    private defaultState = {
        defaultValue: true,
        switchValue: true,
        lastEventOrigin: 'None',
    };

    private renderDefault() {
        return html`
            <div class="flex-column" style="width: 250px">
                <h2 class="dn-story-title">Default</h2>
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

    // ###################################
    // Form Story
    // ###################################

    private formState = {
        formData: null as null | FormData,
        formValue: null as null | string,
    };

    private renderForm() {
        return html`
            <div class="flex-column" style="width: 250px">
                <h2 class="dn-story-title">Form Integration</h2>
                <form
                    class="flex-column"
                    @submit=${(e: Event) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const jsonFormData = {} as any;
                        formData.forEach((value, key) => {
                            jsonFormData[key] = value;
                        });

                        console.log('Form submitted with value:', jsonFormData);
                        this.formState.formData = jsonFormData;
                        this.requestUpdate();
                    }}
                >
                    <dn-input-switch name="switch"></dn-input-switch>
                    <button type="submit" class="dn-story-btn">Submit Form</button>
                </form>
            </div>
            <pre id="form-json" class="dn-story-json"></pre>
        `;
    }

    public render() {
        return html`
            <div class="dn-stories">
                <div class="dn-story">
                    <div class="flex-row">${this.renderDefault()}</div>
                    <hr />
                    <div class="flex-row">${this.renderForm()}</div>
                </div>
            </div>
        `;
    }
}
