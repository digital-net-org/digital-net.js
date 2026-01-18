import { DigitalElement } from '../../modules/Component';

export class InputSwitch extends DigitalElement {
    render() {
        return `<div class="square">I should render correctly! If not then I'm very sorry.</div>`;
    }
    renderStyle() {
        return '.square { width: 100px; height: 100px; background-color: lightblue; }';
    }
}
