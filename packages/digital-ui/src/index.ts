import type { DnAvatar, DnIcon, DnInputSwitch } from './components';

export * from './components';

declare global {
    interface HTMLElementTagNameMap {
        'dn-avatar': DnAvatar;
        'dn-icon': DnIcon;
        'dn-input-switch': DnInputSwitch;
    }
}
