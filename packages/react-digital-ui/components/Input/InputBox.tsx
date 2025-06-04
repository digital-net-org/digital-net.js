import React, { type PropsWithChildren } from 'react';
import { useClassName } from '@digital-net/react-core';
import { Box } from '../Box';
import { Text } from '../Text';
import type { SafariNode } from '../types';
import type { InputBoxProps } from './types';
import './InputBox.styles.css';
import { PopOver } from '../PopOver';

export function InputBox({ children, id, label, help, ...props }: PropsWithChildren<InputBoxProps & SafariNode>) {
    const className = useClassName(props, 'DigitalUi-InputBox');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);
    const boxRef = React.useRef<HTMLDivElement>(null);

    return (
        <React.Fragment>
            <Box
                id={id}
                className={className}
                direction="row"
                mt={label ? 2 : 1}
                gap={2}
                justify="space-between"
                align="center"
                fullWidth={props.fullWidth}
            >
                {label && (
                    <label className="DigitalUi-Input-label">
                        <div className="DigitalUi-Input-label-text">{label}</div>
                        {help && !props.disabled && (
                            <div
                                className="DigitalUi-Input-label-help"
                                ref={boxRef}
                                onClick={() => setIsHelpOpen(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
                                </svg>
                            </div>
                        )}
                    </label>
                )}
                {children}
            </Box>
            <PopOver anchor={boxRef.current} open={isHelpOpen} onClose={() => setIsHelpOpen(false)} includeAnchor>
                <Box className="DigitalUi-Input-help">
                    <Text variant="span" size="xsmall" italic>
                        {help}
                    </Text>
                </Box>
            </PopOver>
        </React.Fragment>
    );
}
