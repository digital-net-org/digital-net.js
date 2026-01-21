import { html, DigitalElement } from '../../../digital-component';
import { styles } from './InputSwitch.styles.js';

export class InputSwitch extends DigitalElement {
    static styles = styles;

    constructor() {
        super();
    }

    _test = 1;

    get value() {
        return this.shadowRoot.querySelector('.input-switch-input').checked;
    }

    set value(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError(`[TypeError InputSwitch.value] value must be a boolean`);
        }
        const input = this.shadowRoot.querySelector('.input-switch-input');
        if (!input) {
            throw new Error('[Error InputSwitch.value] input element not found in shadow DOM');
        }

        input.checked = value;
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }

    get test() {
        return this._test;
    }
    set test(v) {
        if (this._test === v) return;
        this._test = v;
        this.update();
    }

    render() {
        return html`
            <div class="input-switch-container">
                <button :data-test=${this.test} @click=${e => void 0}>${this.test}</button>
                <!-- 
                    FIXME: NESTED_HTML: 
                        This isn't supported right now as HTMLResult IDs are predictable indexes.
                        For nested renderings like this, we would need a way to generate unique IDs for each DigitalElement instance.
                        And then pass those IDs down to nested HTMLResults to avoid collisions.
                -->
                ${this.test < 15
                    ? html`<div style="color: red;">ééééé</div>`
                    : html`<div style="color: ${this.test < 20 ? 'green' : 'blue'};">Ohhhh</div>`}
                <label class="input-switch-label">
                    <input class="input-switch-input" type="checkbox" @change=${e => (this.value = e.target.checked)} />
                    <span class="input-switch-slider"></span>
                </label>
            </div>
        `;
    }
}
