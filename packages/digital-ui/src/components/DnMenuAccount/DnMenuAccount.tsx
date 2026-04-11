import * as React from 'react';
import {
    Box,
    CircularProgress,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Stack,
    Typography,
} from '@mui/material';
import { AccountCircle as AccountIcon, Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { css, styled } from '@mui/material/styles';
import { DnAppBarMenu } from '../DnAppBarMenu';

export interface DnMenuAccountProps {
    username?: string;
    imgSrc?: string;
    disabled?: boolean;
    loading?: boolean;
    onMyAccountClick?: () => void;
    onLogoutClick?: () => void;
}

export function DnMenuAccount({
    imgSrc,
    username,
    loading,
    onMyAccountClick,
    onLogoutClick,
    ...IconButtonProps
}: DnMenuAccountProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <React.Fragment>
            <IconButton color="inherit" {...IconButtonProps} onClick={handleClick}>
                <AccountIcon />
            </IconButton>
            <DnAppBarMenu anchorEl={anchorEl} onClose={handleClose}>
                <UsernameBox>
                    {loading ? <CircularProgress size={18} /> : <Box sx={{ width: 18 }} />}
                    <Typography fontWeight="medium">{username ?? ''}</Typography>
                </UsernameBox>
                <MenuList>
                    <MenuItem disabled={loading} onClick={onMyAccountClick}>
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Mon compte</ListItemText>
                    </MenuItem>
                    <MenuItem disabled={loading} onClick={onLogoutClick}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Déconnexion</ListItemText>
                    </MenuItem>
                </MenuList>
            </DnAppBarMenu>
        </React.Fragment>
    );
}

const UsernameBox = styled(Stack)(
    ({ theme }) => css`
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0 1rem 0.5rem;
        border-bottom: 1px solid ${theme.palette.divider};
        user-select: none;
    `
);
