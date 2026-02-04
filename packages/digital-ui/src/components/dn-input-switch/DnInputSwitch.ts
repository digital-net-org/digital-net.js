import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { CustomElement } from '../CustomElement';
import { styles } from './DnInputSwitch.styles';

export class DnInputSwitch extends CustomElement {
    static styles = styles;

    /**
     * The value of the switch. When true, the switch is on; when false, the switch is off.
     */
    @property({ type: Boolean })
    value = false;

    _handleClick(e: Event) {
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

    render() {
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
