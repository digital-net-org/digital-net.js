import React from 'react';
import { Box, Icon, InputNavButton } from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { useDigitalRouter } from '../../../Router';
import { AppLogo } from '../../AppLogo';

export function NavigationActions() {
    const { current, router } = useDigitalRouter();
    const filteredRouter = React.useMemo(
        () => router.filter(route => !route.isPublic && route.displayed).sort((a, b) => a.path.localeCompare(b.path)),
        [router]
    );

    return (
        <Box className="DigitalUi-AppNavigation" fullWidth>
            <InputNavButton
                options={filteredRouter.map(r => r.path)}
                onSelect={value => filteredRouter.find(r => r.path === value)?.navigate()}
                onRender={value => Localization.translate(`router:page.title.${value}`)}
                value={current?.path}
                icon={<Icon.MenuIcon />}
                direction="left"
            >
                {Localization.translate('app:navigation.label')}
            </InputNavButton>
            <AppLogo />
        </Box>
    );
}
