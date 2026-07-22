import * as React from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import type { ContextMenuPosition } from './useContextMenu';

export interface DnContextMenuItem {
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick: () => void;
}

export interface DnContextMenuProps {
    position: ContextMenuPosition | null;
    items: DnContextMenuItem[];
    onClose: () => void;
}

export function DnContextMenu({ position, items, onClose }: DnContextMenuProps) {
    const handleItemClick = (item: DnContextMenuItem) => {
        item.onClick();
        onClose();
    };

    return (
        <Menu
            open={position !== null}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={position ?? undefined}
            disableRestoreFocus
            slotProps={{ list: { dense: true, onContextMenu: (event: React.MouseEvent) => event.preventDefault() } }}
        >
            {items.map(item => (
                <MenuItem key={item.label} disabled={item.disabled} onClick={() => handleItemClick(item)}>
                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                    <ListItemText>{item.label}</ListItemText>
                </MenuItem>
            ))}
        </Menu>
    );
}
