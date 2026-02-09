import type { CSSProperties } from 'react';

export interface EssentialReactProps {
    /**
     * The **`id`** property of the Element interface represents the element's identifier, reflecting the **`id`** global attribute.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/id)
     */
    id?: string;
    /**
     * The **`className`** property of the of the specified element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/className)
     */
    className?: string;
    /**
     * The **`style`** property of the HTMLElement interface represents the inline styles of an element, reflecting the **`style`** global attribute.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/style)
     */
    style?: CSSProperties;
    /**
     * The **`slot`** property of the Element interface returns the name of the shadow DOM slot the element is inserted in.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/slot)
     */
    slot?: string;
    /**
     * The **`part`** property of the Element interface represents the part identifier(s) of the element (i.e., set using the `part` attribute), returned as a DOMTokenList.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/part)
     */
    part?: string;
    /**
     * The **`role`** property of the Element interface represents the ARIA role of the element, reflecting the **`role`** global attribute.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/role)
     */
    role?: string;

    /**
     * Custom data attributes (data-*) are used to store custom data private to the page or application.
     *
     * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/data-*)
     */
    [key: `data-${string}`]: string | undefined;
}
