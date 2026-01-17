export class DigitalElement extends HTMLElement {
    #isExtended() {
        if (this.constructor === DigitalElement) {
            throw new TypeError('Cannot instantiate abstract class DigitalElement directly.');
        }
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {}

    /** @abstract */
    render() {
        throw new Error(`${this.constructor.name}: You must implement render()`);
    }
}
