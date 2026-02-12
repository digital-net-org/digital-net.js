import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { CustomElement } from '../CustomElement';
import { hostStyles, styles } from './DnButton.styles';
import { fontPalette } from '../palettes';
import type { DnIcon } from '../dn-icon';

/**
 * Digital UI - Button Component
 *
 * A button component that can be used to trigger an action or event.
 * @event click - Fired when the button is clicked.
 * @example CSS Variables overrides
 * --dn-spacing-1: 1rem;
 * --dn-spacing-2: 1rem;
 * --dn-spacing-radius-1: 1rem;
 * --dn-palette-primary: #000000;
 * --dn-palette-primary-light: #000000;
 * --dn-palette-background-disabled: #000000;
 * --dn-palette-text-disabled: #000000;
 * --dn-palette-text: #000000;
 */
@customElement('dn-button')
export class DnButton extends CustomElement {
    public static styles = [fontPalette, hostStyles, styles];

    /**
     * When true, the button will render as disabled button. The events will not be triggered.
     * @default false
     */
    @property({ type: Boolean })
    public disabled: boolean = false;

    /**
     * When true, the button will render a loader instead of its slot. The events will not be triggered.
     * @default false
     */
    @property({ type: Boolean })
    public loading: boolean = false;

    /**
     * When true, the button will render as hovered.
     */
    @property({ type: Boolean })
    public active: boolean = false;

    /**
     * When true, the button colors will match the error palette color.
     * @default false
     */
    @property({ type: Boolean })
    public critical: boolean = false;

    /**
     * This determines appearance of the button. Can be one of the following: 'default', 'outlined', 'text'.
     * @default 'default'
     */
    @property({ type: String })
    public variant: 'default' | 'outlined' | 'text' = 'default';

    /**
     * When defined, will replace the slot with the corresponding icon.
     */
    @property({ type: String })
    public icon: DnIcon['name'] | null | undefined = undefined;

    private _handleClick(e: Event) {
        if (this.disabled || this.loading) {
            e.preventDefault();
            return;
        }
        e.stopPropagation();
        const event = new Event('click', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    public render() {
        return html`
            <button
                class=${classMap({
                    button: true,
                    icon: Boolean(this.icon),
                    active: this.active,
                    [`button-${this.variant}`]: true,
                    critical: this.critical,
                    disabled: this.disabled,
                    loading: this.loading,
                })}
                @click=${this._handleClick}
            >
                ${this.loading ? html` <dn-loader class="button-loader" size="small"></dn-loader>` : ''}
                <span class="button-content">
                    ${this.icon ? html` <dn-icon name=${this.icon} size="small"></dn-icon>` : html`<slot></slot>`}
                </span>
            </button>
        `;
    }
}
