import type { DnAvatar, DnIcon, DnInputSwitch } from './components';

export * from './components';

declare global {
    interface HTMLElementTagNameMap {
        'dn-avatar': DnAvatar;
        'dn-icon': DnIcon;
        /**
         * Digital UI - Input Switch Component
         *
         * A toggle switch component behaving like a native checkbox.
         * @event change - Fired when the checked state changes.
         * @event click - Fired when the element is clicked.
         * @example CSS Variables overrides
         *  dn-palette-primary: #000000;
         *  dn-palette-background-disabled: #000000;
         *  dn-palette-shadow-light: #000000;
         */
        'dn-input-switch': DnInputSwitch;
    }
}
