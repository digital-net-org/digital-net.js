import { html, svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property, customElement } from 'lit/decorators.js';
import { CustomElement } from '../CustomElement';
import type { Direction, Size } from '../types';
import { hostStyles, styles } from './DnIcon.styles';
import { type IconKey, icon16PxPaths } from './icon16PxPaths';

/**
 * Digital UI - Icon Component
 *
 * An icon component that contains various SVG icons accessible via the 'name' attribute.
 * @event click - Fired when the icon is clicked.
 * @example CSS Variables overrides
 * --dn-icon-color: #000000;
 * --dn-icon-cursor: pointer;
 * --dn-icon-color-hover: #000000;
 */
@customElement('dn-icon')
export class DnIcon extends CustomElement {
    public static styles = [hostStyles, styles];

    /**
     * The key of the icon to display.
     * @default null
     */
    @property({ type: String })
    public name: IconKey | null = null;

    /**
     * This determines the orientation of the icon slider. Can be 'up', 'down', 'left', or 'right'.
     * @default 'up'
     */
    @property({ type: String })
    public direction: Direction = 'up';

    /**
     * This determines the size of the icon. Can be 'x-small', 'small', 'medium', 'large', or 'x-large'.
     * @default 'medium'
     */
    @property({ type: String })
    public size: Size = 'medium';

    /**
     * When true, the icon will take up the full width of its container.
     * @default false
     */
    @property({ type: Boolean, attribute: 'full-width', reflect: true })
    public fullWidth = false;

    private _handleClick(e: Event) {
        e.stopPropagation();
        const event = new Event('click', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    public render() {
        if (!this.name) {
            console.warn("DnIcon: 'name' attribute is missing. Icon will not render.", this);
            return '';
        }

        const paths = icon16PxPaths[this.name];
        if (!paths) {
            console.warn(`DnIcon: Icon '${this.name}' not found in available templates.`, this);
        }

        return html`
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class=${classMap({
                    icon: true,
                    [`icon-size-${this.size}`]: this.size && !this.fullWidth,
                    'icon-fullWidth': this.fullWidth,
                    [`icon-direction-${this.direction}`]: !!this.direction,
                })}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                @click=${this._handleClick}
            >
                ${paths ? paths.map(path => svg`<path d="${path}"></path>`) : ''}
            </svg>
        `;
    }
}
