import React from 'react';
import type { RouteObject } from '../RouteObject';

export default class RouterBuilder {
    public static build(): Array<RouteObject> {
        const raw = this.getRawPages();
        return Object.keys(raw).map(filePath => ({
            path: this.handleSlug(this.buildUrl(filePath)),
            isPublic: this.handleArg(filePath, 'public'),
            displayed: !this.hasSlug(filePath),
            element: React.createElement((raw[filePath] as any).default),
        }));
    }

    public static buildUrl(path: string): string {
        const result = path.replace('/src/pages/', '/').replace(/\/page[^/]*\.tsx$/, '');
        return result === '' ? '/' : result;
    }

    public static getRawPages = () =>
        (import.meta as unknown as { glob: any }).glob(['/src/pages/**/page*.tsx'], { eager: true });

    public static hasSlug = (path: string): boolean => /\[.*?]/.test(path);
    public static handleSlug = (path: string): string => path.replace(/\[(.*?)]/g, ':$1');
    public static handleArg = (path: string, arg: string): boolean => path.includes(`page.${arg}.tsx`);
}
