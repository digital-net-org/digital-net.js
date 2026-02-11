import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { CustomFormElement } from '../CustomFormElement';
import { styles } from './DnInputSwitch.styles';

/**
 * Digital UI - Input Switch Component
 *
 * A toggle switch component behaving like a native checkbox.
 * @event change - Fired when the checked state changes.
 * @event click - Fired when the element is clicked.
 * @example CSS Variables overrides
 *  --dn-palette-primary: #000000;
 *  --dn-palette-background-disabled: #000000;
 *  --dn-palette-shadow-light: #000000;
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

    /**
     * If true, the element will render as disabled and events wont be fired.
     */
    @property({ type: Boolean, reflect: true })
    public disabled = false;

    public get internalValue(): 'on' | 'off' {
        return this.value ? 'on' : 'off';
    }

    protected onFormUpdate(internals: ElementInternals, changedProperties: Map<string, any>): void {
        if (changedProperties.has('value')) {
            internals.setFormValue(String(this.value));
        }
    }

    private _handleChange(e: Event) {
        if (this.disabled) {
            e.preventDefault();
            return;
        }
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        this.value = target.checked;
        const event = new Event('change', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    private _handleClick(e: Event) {
        if (this.disabled) {
            e.preventDefault();
            return;
        }
        e.stopPropagation();
        const event = new Event('click', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    public render() {
        return html`
            <div class="input-switch-container">
                <label class="input-switch-label">
                    <input
                        class=${classMap({
                            'input-switch-input': true,
                            disabled: this.disabled,
                        })}
                        type="checkbox"
                        .name="${this.name}"
                        .value="${this.internalValue}"
                        ?checked="${this.value}"
                        @change="${this._handleChange}"
                        @click="${this._handleClick}"
                    />
                    <span
                        class=${classMap({
                            'input-switch-slider': true,
                            disabled: this.disabled,
                        })}
                    ></span>
                </label>
            </div>
        `;
    }
}
