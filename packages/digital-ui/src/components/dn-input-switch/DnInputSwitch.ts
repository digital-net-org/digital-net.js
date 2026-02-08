import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { styles } from './DnInputSwitch.styles';
import { CustomFormElement } from '../CustomFormElement';

/**
 * Digital UI - Input Switch Component
 * @summary A toggle switch component behaving like a native checkbox.
 * @event change - Fired when the checked state changes. Standard Event bubbling up.
 */
@customElement('dn-input-switch')
export class DnInputSwitch extends CustomFormElement {
    public static styles = styles;

    /**
     * The state of the switch (true = on, false = off).
     */
    @property({ type: Boolean, reflect: true })
    public value = false;

    /**
     * The name attribute for form submission. If not set, the switch will not be included in form data.
     */
    @property({ type: String })
    public name = '';

    public get internalValue(): 'on' | 'off' {
        return this.value ? 'on' : 'off';
    }

    protected onFormUpdate(internals: ElementInternals, changedProperties: Map<string, any>): void {
        if (changedProperties.has('value')) {
            internals.setFormValue(String(this.value));
        }
    }

    private _handleChange(e: Event) {
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        const event = new Event('change', { bubbles: true, composed: true });
        if (event.defaultPrevented) {
            e.preventDefault();
        }

        this.value = target.checked;
        this.dispatchEvent(event);
    }

    public render() {
        return html`
            <div class="input-switch-container">
                <label class="input-switch-label">
                    <input
                        class="input-switch-input"
                        type="checkbox"
                        .name="${this.name}"
                        .checked="${this.value}"
                        .value="${this.internalValue}"
                        @change="${this._handleChange}"
                    />
                    <span class="input-switch-slider"></span>
                </label>
            </div>
        `;
    }
}
