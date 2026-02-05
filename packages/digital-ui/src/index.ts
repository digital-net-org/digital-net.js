import type { DnInputSwitch } from './components';
export * from './components';

declare global {
    interface HTMLElementTagNameMap {
        'input-switch': DnInputSwitch;
    }
}
