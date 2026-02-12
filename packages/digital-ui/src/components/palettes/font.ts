import { css } from 'lit';

export const fontPalette = css`
    :host {
        font-family: var(--dn-font-family);
        font-size: var(--dn-font-size-regular);
        font-weight: var(--dn-font-weight-regular);
        color: var(--dn-palette-text);
        letter-spacing: var(--dn-font-letter-spacing);
    }
`;
