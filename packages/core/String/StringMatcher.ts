export class StringMatcher {
    public static isEmpty(str: string | undefined): boolean {
        return !str || str.length === 0;
    }

    public static isCamelCase(str: string): boolean {
        return /^[a-z]+([A-Z][a-z0-9]*)*$/.test(str);
    }

    public static isPascalCase(str: string): boolean {
        return /^[A-Z][a-z0-9]*([A-Z][a-z0-9]*)*$/.test(str);
    }

    public static isSnakeCase(str: string): boolean {
        return /^[a-z0-9]+(_[a-z0-9]+)*$/.test(str);
    }

    public static isUpperSnakeCase(str: string): boolean {
        return /^[A-Z0-9]+(_[A-Z0-9]+)*$/.test(str);
    }
}
