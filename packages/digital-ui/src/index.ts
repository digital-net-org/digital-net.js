import type { DnIcon, DnInputSwitch } from './components';
export * from './components';

declare global {
    interface HTMLElementTagNameMap {
        'input-switch': DnInputSwitch;
        'dn-input': DnIcon;
    }
}
