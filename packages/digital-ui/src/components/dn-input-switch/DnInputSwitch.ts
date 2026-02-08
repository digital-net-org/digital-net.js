import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { CustomElement } from '../CustomElement';
import { styles } from './DnInputSwitch.styles';

export type NativeCheckValue = 'on' | 'off';
export type BooleanCheckValue = 'true' | 'false';

/**
 * Digital UI - Input Switch Component
 * @summary A toggle switch component behaving like a native checkbox.
 * @event change - Fired when the checked state changes. Standard Event bubbling up.
 */
@customElement('dn-input-switch')
export class DnInputSwitch extends CustomElement {
    public static styles = styles;

    /**
     * The state of the switch (true = on, false = off).
     */
    @property({ type: Boolean, reflect: true })
    public value = false;

    /**
     * The value submitted when using internal form data (defaults to "on" like native).
     */
    @property({ type: String })
    public internalValue: NativeCheckValue = 'on';

    private _handleChange(e: Event) {
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        const event = new Event('change', { bubbles: true, composed: true });
        if (event.defaultPrevented) {
            e.preventDefault();
        }

        this.value = target.checked;
        this.internalValue = target.checked ? 'on' : 'off';
        this.dispatchEvent(event);
    }

    public render() {
        return html`
            <div class="input-switch-container">
                <label class="input-switch-label">
                    <input
                        class="input-switch-input"
                        type="checkbox"
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
