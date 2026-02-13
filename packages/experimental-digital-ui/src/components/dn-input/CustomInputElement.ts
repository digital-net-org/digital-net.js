import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { CustomFormElement } from '../CustomFormElement';
import { fontPalette } from '../palettes';
import { styles } from './CustomInputElement.styles';

/**
 * Base class for input custom elements.
 */
export abstract class CustomInputElement<T extends string | File | FormData | null> extends CustomFormElement {
    public static styles = [fontPalette, styles];

    /**
     * The value of the input.
     */
    public abstract value: T;

    /**
     * The name attribute for form submission. If not set, the input will not be included in form data.
     * @default ''
     */
    @property({ type: String })
    public name = this.tagName;

    /**
     * The label that will render above the input.
     * @default undefined
     */
    @property({ type: String })
    public label: string | null | undefined = undefined;

    /**
     * A text message to display on the top of the input.
     * @default undefined
     */
    @property({ type: String })
    public hint: string | null | undefined = undefined;

    /**
     * If true, the element will render as disabled and events wont be fired.
     */
    @property({ type: Boolean, reflect: true })
    public disabled = false;

    /**
     * When true, the input will render a loader after its slot. The events will not be triggered.
     * @default false
     */
    @property({ type: Boolean, reflect: true })
    public loading: boolean = false;

    /**
     * When true, the input will be required for form submission.
     * @default false
     */
    @property({ type: Boolean, reflect: true })
    public required: boolean = false;

    @state()
    private _isHintVisible = false;

    public abstract renderInput(): TemplateResult;

    /**
     * Returns true if the input is disabled or loading.
     */
    protected get isBusy(): boolean {
        return this.disabled || this.loading;
    }

    protected onFormUpdate(internals: ElementInternals, changedProperties: Map<string, any>): void {
        if (changedProperties.has('value')) {
            let resolved = this.value ?? null;
            if (
                typeof this.value !== 'string' &&
                !(this.value instanceof File) &&
                !(this.value instanceof FormData) &&
                this.value !== null
            ) {
                // @ts-expect-error
                resolved = String(this.value);
            }
            internals.setFormValue(resolved);
        }
    }

    public render() {
        return html`
            <div
                class=${classMap({
                    'input-box': true,
                    disabled: this.disabled,
                    loading: this.loading,
                    hint: Boolean(this.hint),
                    'with-label': Boolean(this.label?.length),
                })}
            >
                ${this.renderLabel()} ${this.renderInput()}
            </div>
            ${this.renderHint()}
        `;
    }

    private renderLabel() {
        return !this.label
            ? ''
            : html`
                  <label for=${this.name} class="input-label">
                      <div class="label-text">${this.label}</div>
                      ${this.renderHintButton()}
                  </label>
              `;
    }

    private renderHint() {
        if (!this.hint) {
            return '';
        }

        return html`
            <div
                class=${classMap({ 'input-hint': true, open: this._isHintVisible })}
                aria-hidden="${!this._isHintVisible}"
            >
                <div class="input-hint-content">
                    <p>${this.hint}</p>
                </div>
            </div>
        `;
    }

    private renderHintButton() {
        return this.hint && !this.disabled
            ? html`
                  <div
                      class=${classMap({ 'label-hint': true, open: this._isHintVisible })}
                      @click=${() => (this._isHintVisible = !this._isHintVisible)}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path
                              d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"
                          />
                      </svg>
                  </div>
              `
            : '';
    }
}
