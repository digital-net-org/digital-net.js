import i18next, { type i18n, changeLanguage, reloadResources, t } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { LocalStorage } from '../../core';
import { ResourcesBuilder } from './Resources';

export type SupportedLanguage = (typeof Localization.supportedLanguages)[number];

export default class Localization {
    public static accessor = 'i18nextLng';
    public static supportedLanguages = ['fr', 'en'] as const;
    public static defaultLanguage = 'en';

    public static translate(value: string, interpolation?: Record<string, any>) {
        return t(value, interpolation);
    }

    public static initLanguage() {
        return (LocalStorage.get<string>(this.accessor) ?? this.defaultLanguage) as SupportedLanguage;
    }

    public static updateLanguage(value: SupportedLanguage) {
        (async () => {
            if (!value || !this.supportedLanguages.find(x => x == value)) {
                return;
            }
            await changeLanguage(value);
            await reloadResources(value);
        })();
    }

    public static init() {
        (async () => {
            await i18next
                .use(LanguageDetector)
                .use(initReactI18next)
                .init({
                    detection: {
                        order: ['localStorage', 'navigator'],
                        caches: ['localStorage'],
                        lookupLocalStorage: Localization.accessor,
                    },
                    interpolation: {
                        escapeValue: false,
                    },
                    react: {
                        bindI18n: 'loaded languageChanged',
                        bindI18nStore: 'added',
                        useSuspense: true,
                    },
                    supportedLngs: Localization.supportedLanguages,
                    fallbackLng: Localization.defaultLanguage,
                    resources: ResourcesBuilder.build(),
                });
        })();
    }
}
