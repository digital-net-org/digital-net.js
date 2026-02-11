import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { Size } from '../types';
import { CustomElement } from '../CustomElement';
import { hostStyles, styles } from './DnLoader.styles';

/**
 * Digital UI - Loader Component
 *
 * A loading indicator in a shape of an animated ellipsis.
 * @example CSS Variables overrides
 *  --dn-palette-text: #000000;
 *  --dn-loader-color: #000000;
 */
@customElement('dn-loader')
export class DnLoader extends CustomElement {
    public static styles = [hostStyles, styles];

    /**
     * This determines the size of the loader. Can be 'x-small', 'small', 'medium', 'large' or 'x-large'.
     * @default 'medium'
     */
    @property({ type: String })
    public size: Size = 'medium';

    public render() {
        return html`
            <div
                class=${classMap({
                    loader: true,
                    [`loader-size-${this.size}`]: true,
                })}
            >
                ${Array(4)
                    .fill(null)
                    .map(() => html`<div></div>`)}
            </div>
        `;
    }
}
