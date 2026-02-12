import type { DnAvatar, DnButton, DnIcon, DnInputSwitch, DnInputText, DnLoader } from './components';

export * from './components';

declare global {
    interface HTMLElementTagNameMap {
        'dn-avatar': DnAvatar;
        'dn-button': DnButton;
        'dn-icon': DnIcon;
        'dn-input-switch': DnInputSwitch;
        'dn-input-text': DnInputText;
        'dn-loader': DnLoader;
    }
}
