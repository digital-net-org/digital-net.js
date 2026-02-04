import * as Components from './components';
import { CustomElement } from './components/CustomElement';
import { CustomElementError } from './components/CustomElementError';

export * from './components';

/**
 * Digital UI CustomElement Id
 */
export type CustomElementId = keyof typeof Components;

/**
 * Defines the elements of the Digital UI library as custom elements.
 * @param elementIds - The ids of the elements to define. If empty, all elements will be defined.
 * @throws {CustomElementError} If a provided element id is invalid or if the element does not extend CustomElement.
 */
export function defineDigitalUI(...elementIds: CustomElementId[]) {
    if (elementIds.length === 0) {
        Object.values(Components).forEach(Component => {
            if (typeof Component !== 'function') {
                return;
            }
            if (Component.prototype instanceof CustomElement) {
                console.log('Defining custom element:', (Component as typeof CustomElement).defaultTagName);
                (Component as typeof CustomElement).define();
            }
        });
    } else {
        for (const id of elementIds) {
            const Component = Components[id];
            if (typeof Component !== 'function') {
                throw new CustomElementError(
                    `Component with id ${id} is not a valid CustomElement.`,
                    'defineDigitalUI'
                );
            }
            if (!(Component.prototype instanceof CustomElement)) {
                throw new CustomElementError(
                    `Component with id ${id} does not extend CustomElement.`,
                    'defineDigitalUI'
                );
            }
            Component.define();
        }
    }
}
