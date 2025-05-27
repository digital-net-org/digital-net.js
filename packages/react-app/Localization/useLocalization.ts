import React from 'react';
import Localization, { type SupportedLanguage } from './Localization';

export default function useLocalization() {
    const [currentLanguage, setCurrentLanguage] = React.useState<SupportedLanguage>(Localization.initLanguage());

    const setLanguage = React.useCallback((value: SupportedLanguage | undefined) => {
        if (!value) {
            return;
        }
        Localization.updateLanguage(value);
        setCurrentLanguage(value);
    }, []);

    return {
        currentLanguage,
        setLanguage,
    };
}
