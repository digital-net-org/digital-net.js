import { LitElement } from 'lit';
import { StringResolver } from '@digital-net/core';

/**
 * Base class for custom elements in the Digital UI library, extending LitElement.
 */
export abstract class CustomElement extends LitElement {
    protected constructor() {
        super();
    }

    /**
     * The default tag name for the custom element, derived from the class name in kebab-case format.
     * For instance if the class name is `MyCustomElement`, the default tag name will be `my-custom-element`.
     */
    public static get defaultTagName(): string {
        return StringResolver.toKebabCase(this.name);
    }
}
