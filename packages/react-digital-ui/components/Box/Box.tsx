import React from 'react';
import { useClassName } from '@digital-net/core';
import type { SafariNodeWithChildren } from '../types';
import './Box.styles.css';

type BaseBoxProps = React.HTMLAttributes<HTMLDivElement> & SafariNodeWithChildren;

type spacing = null | 0 | 1 | 2 | 3;

export interface BoxProps extends BaseBoxProps {
    element?: 'div' | 'span' | 'form' | 'section' | 'main';
    p?: spacing;
    pt?: spacing;
    pb?: spacing;
    m?: spacing;
    mt?: spacing;
    mb?: spacing;
    gap?: spacing;
    visible?: boolean;
    resizable?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    wrap?: boolean;
    direction?: 'row' | 'column';
    align?: 'start' | 'center' | 'end';
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    color?: string;
    overflow?: 'hidden' | 'scroll' | 'auto';
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
    (
        {
            element = 'div',
            resizable = false,
            fullWidth = false,
            fullHeight = false,
            wrap = false,
            visible = true,
            p = null,
            m = null,
            gap = null,
            direction = 'column',
            align = 'start',
            justify = 'start',
            color,
            ...props
        }: BoxProps,
        ref
    ) => {
        const className = useClassName(
            {
                resizable,
                fullWidth,
                fullHeight,
                wrap,
                p,
                m,
                gap,
                direction,
                align,
                justify,
                ...props,
            },
            'DigitalUi-Box'
        );
        return React.createElement(element, {
            ...props,
            style: {
                backgroundColor: color,
                opacity: visible ? 1 : 0,
            },
            ref,
            className,
        });
    }
);
