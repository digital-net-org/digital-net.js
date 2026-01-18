import { InputSwitch } from './InputSwitch.js';

InputSwitch.define();

export default {
    title: 'DigitalUI/InputSwitch',
    component: 'input-switch',
};

export const Default = {
    render: args => {
        const el = document.createElement('input-switch');
        Object.assign(el, args);
        return el;
    },
    args: {
        label: 'Something whatever possibly maybe',
        checked: false,
    },
};
