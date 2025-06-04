import type { ComputedSpacing } from './types';

export class Spacing {
    public static getPadding = (element: HTMLElement): ComputedSpacing => {
        const computedStyle = window.getComputedStyle(element);
        return {
            top: parseInt(computedStyle.paddingTop),
            right: parseInt(computedStyle.paddingRight),
            bottom: parseInt(computedStyle.paddingBottom),
            left: parseInt(computedStyle.paddingLeft),
        };
    };

    public static getMargin = (element: HTMLElement): ComputedSpacing => {
        const computedStyle = window.getComputedStyle(element);
        return {
            top: parseInt(computedStyle.marginTop),
            right: parseInt(computedStyle.marginRight),
            bottom: parseInt(computedStyle.marginBottom),
            left: parseInt(computedStyle.marginLeft),
        };
    };
}
