import React from 'react';
import { Box, IconButton, PopOver, Text } from '@digital-net/react-digital-ui';
import './Alerts.styles.css';

export interface AppAlert {
    key: string;
    title: string;
    message: string;
    onClick?: () => void;
}

export interface AppAlertsProps {
    alerts: Array<AppAlert>;
}

export function AppAlerts({ alerts }: AppAlertsProps) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(!open);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    return (
        alerts.length > 0 && (
            <React.Fragment>
                <IconButton ref={buttonRef} icon="WarnBoxIcon" onClick={handleOpen} selected={open} critical />
                <PopOver anchor={buttonRef.current} open={open} onClose={handleOpen} direction="right" includeAnchor>
                    {alerts.map(({ title, message, onClick, key }) => (
                        <Box
                            key={key}
                            className={`AppAlert${onClick !== undefined ? ' AppAlert-Action' : ''}`}
                            onClick={() => {
                                onClick?.();
                                handleOpen();
                            }}
                            gap={1}
                        >
                            <Text className="AppAlert-Title" size="small">
                                {title}
                            </Text>
                            <Text className="AppAlert-Message" size="small">
                                {message}
                            </Text>
                        </Box>
                    ))}
                </PopOver>
            </React.Fragment>
        )
    );
}
