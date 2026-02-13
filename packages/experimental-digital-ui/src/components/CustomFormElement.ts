import { CustomElement } from './CustomElement';

/**
 * Base class for custom elements that are designed to be used as form controls.
 */
export abstract class CustomFormElement extends CustomElement {
    public static formAssociated = true;
    private _internals: ElementInternals;

    protected constructor() {
        super();
        this._internals = this.attachInternals();
    }

    /**
     * Implement this method to set the form value based on the current state of the component.
     * @param internals Contains the methods to interact with the form.
     * @param changedProperties A map of properties that have changed since the last update.
     */
    protected abstract onFormUpdate(internals: ElementInternals, changedProperties: Map<string, any>): void;

    protected updated(changedProperties: Map<string, any>) {
        this.onFormUpdate(this._internals, changedProperties);
        super.updated(changedProperties);
    }
}
