import AppBar from '@mui/material/AppBar';
import { css, styled } from '@mui/material/styles';
import { DnBreadcrumbs } from '../DnBreadcrumbs';
import { useClassNames } from '../useClassNames';

export interface DnAppBarProps {
    url: string;
    flat?: boolean;
}

export function DnAppBar({ flat, url }: DnAppBarProps) {
    const classNames = useClassNames({ 'DnAppBar-Flat': flat }, [flat]);

    return (
        <CustomAppBar className={`DnAppBar ${classNames}`}>
            <DnBreadcrumbs url={url} />
        </CustomAppBar>
    );
}

const CustomAppBar = styled(AppBar)(
    ({ theme }) => css`
        box-shadow: none;
        background-color: transparent;
        color: ${theme.palette.text.primary};
    `
);
