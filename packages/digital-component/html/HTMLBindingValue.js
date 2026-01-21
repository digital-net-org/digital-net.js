import { DigitalComponentError } from '../Error';
import { HTMLResult } from './HTMLResult.js';

/** @typedef {'event' | 'prop' | 'node' | 'html'} BindingType */
/** @typedef {{ type: BindingType; name: string | null; value: any; index: number; templateId?: string }} HTMLBindingValueConstructor */

export class HTMLBindingValue {
    /**
     * An optional template id this binding belongs to.
     * @type {string | null}
     */
    templateId = null;
    /**
     * Provide information on how to apply the binding.
     * @type {BindingType}
     */
    type;
    /**
     * Corresponds to the event or property name. It is null for node bindings.
     * @type {string | null}
     */
    name;
    /**
     * Binding value.
     * @type {any}
     */
    value;
    /**
     * Index of the binding in the template values array.
     * @type {number}
     */
    index;

    /**
     * Binding id built from the index.
     * @type {string}
     */
    get id() {
        const index = this.templateId ? `${this.templateId}-${this.index}` : this.index;
        return `${HTMLBindingValue.bindingPlaceholderPrefix}${index}`;
    }

    /**
     * Placeholder to put in the HTML.
     * @type string
     */
    get placeholder() {
        if (this.type === 'node' || this.type === 'html') {
            return `<!--${this.id}-->`;
        }
        if (this.type === 'event' || 'prop') {
            return this.id;
        }
    }

    /**
     * Binding attributes to resolve template hydration.
     * @type {string}
     */
    static bindingPlaceholderPrefix = 'data-b-';

    /**
     * Creates a new HTMLBindingValue instance.
     * @param {HTMLBindingValueConstructor} param0 The binding details.
     */
    constructor({ type, name, value, index, templateId }) {
        this.type = type;
        this.name = name;
        this.value = value;
        this.index = index;
        this.templateId = templateId ?? null;
        this.validate();
    }

    /**
     * Analyzes the current instance and validate its values.
     * @throws {DigitalComponentError} Throws if the binding is invalid.
     */
    validate() {
        if (this.type === 'event' && typeof this.value !== 'function') {
            throw new DigitalComponentError(
                `HTMLBindingValue: Event binding for '${this.name}' event must be a function, received '${typeof this.value}'.`,
                'HTMLBindingValue.validate'
            );
        }
        if (this.type === 'prop' && (typeof this.value === 'function' || this.value instanceof HTMLResult)) {
            throw new DigitalComponentError(
                `HTMLBindingValue: Property binding for '${this.name}' property cannot be a function or HTMLResult instance, received '${typeof this.value}'.`,
                'HTMLBindingValue.validate'
            );
        }
        if (this.type === 'html' && !(this.value instanceof HTMLResult)) {
            throw new DigitalComponentError(
                `HTMLBindingValue: HTML binding must be an HTMLResult instance, received '${typeof this.value}'.`,
                'HTMLBindingValue.validate'
            );
        }
    }
}
