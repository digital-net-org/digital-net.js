import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { CustomElement } from '../CustomElement';
import { styles } from './DnInputSwitch.styles';

/**
 * Digital UI - Input Switch Component
 * @summary A toggle switch component that allows users to switch between two states (on/off).
 * @slot - This component does not have any slots.
 * @event change - Fired when the value of the switch changes. The event detail contains the new value of the switch.
 */
@customElement('dn-input-switch')
export class DnInputSwitch extends CustomElement {
    public static styles = styles;

    /**
     * The value of the switch. When true, the switch is on; when false, the switch is off.
     */
    @property({ type: Boolean })
    public value = false;

    private _handleClick(e: Event) {
        e.stopPropagation();
        this.value = !this.value;
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: { value: this.value },
                bubbles: true,
                composed: true,
            })
        );
    }

    public render() {
        return html`
            <div class="input-switch-container">
                <label class="input-switch-label">
                    <input
                        class="input-switch-input"
                        type="checkbox"
                        .checked="${this.value}"
                        @click="${this._handleClick}"
                    />
                    <span class="input-switch-slider"></span>
                </label>
            </div>
        `;
    }
}
