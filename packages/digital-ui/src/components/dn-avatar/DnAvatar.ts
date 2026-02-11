import { type PropertyValues, html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { CustomElement } from '../CustomElement';
import type { Size } from '../types';
import { hostStyles, styles } from './DnAvatar.styles';
import '../dn-icon';

/**
 * Digital UI - Icon Component
 * @summary
 *  A wrapper that resolve to either customized image or an icon component with specified name and size if
 *  the source isn't defined.
 * @event click - Fired when the element is clicked.
 * @cssprop {Color}  --digital-ui-icon-color
 * @cssprop {Length} --digital-ui-icon-size
 * @cssprop {String} --digital-ui-icon-cursor

 */
@customElement('dn-avatar')
export class DnAvatar extends CustomElement {
    public static styles = [hostStyles, styles];

    /**
     * The source URL of the avatar image. If not provided or `undefined`, it will fall back to a default icon.
     * @default null
     */
    @property({ type: String })
    public src: string | null | undefined = null;

    /**
     * The alt text for the avatar image. If not provided or `undefined`, it will fall back to an empty string.
     */
    @property({ type: String })
    public alt: string = '';

    /**
     * This determines the size of the avatar. Can be 'x-small', 'small', 'medium', 'large', or 'x-large'.
     * @default 'medium'
     */
    @property({ type: String })
    public size: Size = 'medium';

    /**
     * When true, the avatar will take up the full width of its container.
     * @default false
     */
    @property({ type: Boolean, attribute: 'full-width', reflect: true })
    public fullWidth = false;

    @state()
    private _hasImageError = false;

    protected willUpdate(changedProperties: PropertyValues) {
        if (changedProperties.has('src')) {
            this._hasImageError = false;
        }
        super.willUpdate(changedProperties);
    }

    private _handleImageError() {
        console.warn('DnAvatar: Image failed to load. Falling back to default icon.');
        this._hasImageError = true;
    }

    private _handleImageLoad() {
        this._hasImageError = false;
    }

    private _handleClick(e: Event) {
        e.stopPropagation();
        const event = new Event('click', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    public render() {
        const showImage = this.src && !this._hasImageError;

        if (showImage) {
            return html`
                <div
                    class=${classMap({
                        avatar: true,
                        'avatar-container': true,
                        [`avatar-size-${this.size}`]: this.size && !this.fullWidth,
                        'avatar-fullWidth': this.fullWidth,
                    })}
                    @click=${this._handleClick}
                >
                    <img
                        src=${ifDefined(this.src)}
                        alt=${this.alt}
                        @error=${this._handleImageError}
                        @load=${this._handleImageLoad}
                    />
                    <dn-icon name="circle" size=${this.size} ?full-width=${this.fullWidth}></dn-icon>
                </div>
            `;
        }

        return html`
            <dn-icon
                @click=${this._handleClick}
                name="account-circle"
                size="${this.size}"
                ?full-width=${this.fullWidth}
            ></dn-icon>
        `;
    }
}
