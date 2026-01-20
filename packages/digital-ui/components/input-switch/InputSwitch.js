import { html, DigitalElement } from '../../../digital-component';
import { styles } from './InputSwitch.styles.js';

export class InputSwitch extends DigitalElement {
    static styles = styles;

    render() {
        return html`
            <div class="input-switch-container">
                <label class="input-switch-label">
                    <input class="input-switch-input" value="true" type="checkbox" checked />
                    <span class="input-switch-slider"></span>
                </label>
            </div>
        `;
    }
}
