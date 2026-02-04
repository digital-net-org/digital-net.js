import { LitElement } from 'lit';
import { CustomElementError } from './CustomElementError';
import { StringResolver } from '@digital-net/core';

export class CustomElement extends LitElement {
    constructor() {
        super();
    }

    public static get defaultTagName() {
        return StringResolver.toKebabCase(this.name);
    }

    static define() {
        if (!customElements.get(CustomElement.defaultTagName)) {
            customElements.define(CustomElement.defaultTagName, this);
        } else {
            throw new CustomElementError(
                `Custom element with tag ${CustomElement.defaultTagName} is already defined.`,
                'CustomElement.define'
            );
        }
    }
}
