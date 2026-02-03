import { InputSwitch } from './InputSwitch.js';

InputSwitch.define();

export default {
    title: 'DigitalUI/InputSwitch',
    component: 'input-switch',
};

export const Default = {
    render: args => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '10px';
        const button = document.createElement('button');
        button.textContent = 'Toggle Switch';
        button.addEventListener('click', () => {
            el.value = !el.value;
        });
        div.appendChild(button);
        const el = document.createElement('input-switch');
        Object.assign(el, args);
        div.appendChild(el);

        el.addEventListener('change', e => {
            console.log('InputSwitch value changed to:', e.target.value);
        });
        return div;
    },
    args: {
        value: false,
    },
};
