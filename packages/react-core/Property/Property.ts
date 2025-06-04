import React from 'react';
import { customProperties, nativeProperties } from './sets';

export class Property {
    /**
     * Map properties to children.
     * @param children - The children to map
     * @param properties - The properties to map
     * @returns The mapped children
     * @example
     * ```tsx
     * <Property.mapProps(
     *   <div>
     *     <span>Child 1</span>
     *     <span>Child 2</span>
     *   </div>,
     *   { className: 'my-class', style: { color: 'red' } }
     * );
     * // Returns:
     * <div>
     *   <span className="my-class" style={{ color: 'red' }}>Child 1</span>
     *   <span className="my-class" style={{ color: 'red' }}>Child 2</span>
     * </div>
     * ```
     * @remarks
     * This method recursively maps the provided properties to each child element.
     * If a child is a React Fragment, it will map the properties to each of its children.
     * If a child is not a valid React element, it will return the child as is.
     * This is useful for applying common properties to multiple children without manually repeating them.
     */
    public static mapProps(children: React.ReactNode, properties: Record<string, unknown>) {
        const mapChild = (child: React.ReactNode): React.ReactNode => {
            if (!React.isValidElement(child)) return child;
            return child.type === React.Fragment
                ? React.cloneElement(
                      child,
                      { key: child.key },
                      React.Children.map((child as any).props.children, mapChild)
                  )
                : React.cloneElement(child, { ...properties, key: child.key });
        };
        return React.Children.map(children, mapChild);
    }

    /**
     * Convert JSX props to HTML props.
     * @param props - The props to convert
     * @returns The converted props
     * @example
     * ```tsx
     * const htmlProps = Property.toHtml({ className: 'my-class', disabled: true, customProp: 'value' });
     * // Returns: { className: 'my-class', disabled: '', customprop: 'value' }
     * ```
     * @remarks
     * This method converts JSX props to HTML props by:
     * - Converting boolean values to empty strings if true, or removing them if false.
     * - Converting property names to lowercase if they are not native or custom properties.
     * - Preserving native and custom properties as they are.
     * - Removing properties that are not recognized as valid HTML attributes.
     * This is useful for ensuring that the properties passed to a React component are compatible with HTML attributes.
     */
    public static toHtml(props: Record<string, unknown>) {
        for (const key in { ...props }) {
            if (typeof props[key] === 'boolean' && props[key] === true) {
                props[key] = '';
            }
            if (typeof props[key] === 'boolean' && props[key] !== true) {
                delete props[key];
                continue;
            }
            if (!nativeProperties.has(key) && !customProperties.has(key)) {
                props[key.toLowerCase()] = props[key];
                delete props[key];
            }
        }
        return props;
    }
}
