import React, { type PropsWithChildren } from 'react';
import { Property } from './Property';

export function useProps<T extends (Partial<unknown> & React.Attributes) & PropsWithChildren>({
    children: propsChildren,
    ...props
}: T) {
    const mapProps = React.useCallback(
        (children?: React.ReactNode | undefined) => Property.mapProps(children ?? propsChildren, props),
        [props, propsChildren]
    );

    const mapHtmlProps = React.useCallback(
        (children?: React.ReactNode | undefined) =>
            Property.mapProps(children ?? propsChildren, Property.toHtml(props)),
        [props, propsChildren]
    );

    return {
        mapProps,
        mapHtmlProps,
    };
}
