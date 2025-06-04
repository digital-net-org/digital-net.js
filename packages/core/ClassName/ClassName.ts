import { StringMatcher } from '../String';
import { actionKeywords, booleanKeywords, excludedKeywords } from './keywords';

export class ClassName {
    public static actionKeywords = actionKeywords;
    public static booleanKeywords = booleanKeywords;
    public static excludedKeywords = excludedKeywords;

    /**
     * Resolve object properties to classnames
     * @param baseClass - The base class to which other classes will be appended
     * @param props - An object containing properties that may include class names, boolean flags, or functions
     * @return A string of class names derived from the properties, or the base class if no additional classes are resolved
     * @example
     * ```ts
     * const className = ClassName.resolveProps('my-component', {
     *     isActive: true,
     *     isDisabled: false,
     *     onClick: () => console.log('Clicked!'),
     *     className: 'custom-class',
     * });
     * // className will be 'my-component my-component-isActive my-component-action custom-class'
     * ```
     */
    public static resolveProps(baseClass: string, props: Record<string, any>) {
        const returnReduced = (acc: string, resolved: string) =>
            StringMatcher.isEmpty(acc) ? resolved : `${acc} ${resolved}`;

        const resolved = Object.keys(props).reduce((acc, key) => {
            if (
                !props[key] ||
                (typeof props[key] === 'string' && StringMatcher.isEmpty(props[key])) ||
                excludedKeywords.has(key) ||
                key.startsWith('aria') ||
                key.startsWith('data')
            ) {
                return acc;
            }
            if (key === 'className' || key === 'class') {
                return returnReduced(acc, props[key]);
            }
            if (actionKeywords.has(key) && typeof props[key] === 'function') {
                return returnReduced(acc, [baseClass, 'action'].join('-'));
            }
            if (booleanKeywords.has(key) && props[key] === true) {
                return returnReduced(acc, [baseClass, key].join('-'));
            }
            if (typeof props[key] === 'string' || typeof props[key] === 'number') {
                return returnReduced(acc, [baseClass, key, props[key]].join('-'));
            }
            return acc;
        }, '');

        return StringMatcher.isEmpty(resolved) ? baseClass : `${baseClass} ${resolved}`;
    }
}
