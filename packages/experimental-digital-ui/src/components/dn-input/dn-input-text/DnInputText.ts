import { html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styles } from './DnInputText.styles';
import { CustomInputElement } from '../CustomInputElement';

/**
 * Digital UI - Input Text Component
 *
 * An input of type text, area, password or email.
 * @event change - Fired when the checked state changes.
 * @example CSS Variables overrides
 *  --dn-palette-primary: #000000;
 *  --dn-palette-background-disabled: #000000;
 *  --dn-palette-shadow-light: #000000;
 */
@customElement('dn-input-text')
export class DnInputText extends CustomInputElement<string> {
    public static styles = [...super.styles, styles];

    /**
     * The state of the input.
     * @default ''
     */
    @property({ type: String, reflect: true })
    public value = '';

    /**
     * The type of the input.
     * @default 'text'
     */
    @property({ type: String, reflect: true })
    public type: 'text' | 'password' | 'email' = 'text';

    /**
     * The max length of the input.
     */
    @property({ type: Number, reflect: true })
    public max: number | undefined | null = undefined;

    @state()
    private _secret = true;

    @state()
    private get _resolvedType(): DnInputText['type'] {
        if (this.type !== 'password') return this.type;
        if (this.disabled) return 'password';
        return this._secret ? 'password' : 'text';
    }

    private _handleChange(e: Event) {
        if (this.isBusy) {
            console.log('is busy');
            e.preventDefault();
            return;
        }
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        console.log(target.value);
        this.value = target.value;
        this.dispatch('change');
    }

    public renderInput() {
        return html`
            <input
                type=${this.type}
                ?disabled=${this.disabled}
                ?required=${this.required}
                .name=${this.name}
                .value="${this.value}"
                maxlength=${ifDefined(this.max)}
                @input=${this._handleChange}
            />
            ${this.renderLoader()} ${this.renderAdornment()} ${this.renderCounter()}
        `;
    }

    private renderAdornment() {
        if (this.type !== 'password') {
            return '';
        }
        return html`
            <dn-icon
                size="x-small"
                name="${this._secret ? 'eye-filled' : 'eye-slashed-filled'}"
                @click=${() => (this._secret = !this._secret)}
            >
            </dn-icon>
        `;
    }

    private renderLoader() {
        if (!this.loading) {
            return '';
        }
        return html` <dn-loader size="small"> </dn-loader> `;
    }

    private renderCounter() {
        if (!this.max) {
            return '';
        }
        return html`<div class="counter">${this.value.length}/${this.max}</div>`;
    }
}
