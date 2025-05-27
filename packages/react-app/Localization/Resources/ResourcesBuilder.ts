/// <reference types="vite/client" />
import { type Resource } from 'i18next';
import { type Namespace } from '../Namespaces';

export default class ResourcesBuilder {
    public static getLocalesFiles(): Record<string, Record<string, any>> {
        return import.meta.glob(['/*/**/locales.ts'], { eager: true });
    }

    public static build() {
        const raw = this.getLocalesFiles();
        const result: Resource = {};
        for (const file in raw) {
            const { namespace, ...locales }: Namespace = raw[file].default;
            Object.keys(locales).forEach(key => {
                const languages = key.match(/(fr|en)$/);
                for (const lang of languages ?? []) {
                    result[lang] = result[lang] ?? {};
                    result[lang][namespace] = (locales as Record<string, any>)[lang];
                }
            });
        }
        return result;
    }
}
