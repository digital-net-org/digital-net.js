import { Box, InputSelect } from '@digital-net/react-digital-ui';
import { Localization, useLocalization } from '../../../../../Localization';

export function PreferencesView() {
    const { currentLanguage, setLanguage } = useLocalization();
    return (
        <Box gap={2}>
            <InputSelect
                required
                options={[...Localization.supportedLanguages]}
                label={Localization.translate('app:settings.user.preferences.options.language.label')}
                value={currentLanguage}
                onChange={setLanguage}
                onRender={value =>
                    Localization.translate(`app:settings.user.preferences.options.language.inputs.${value}`)
                }
            />
        </Box>
    );
}
