import type { TemplateVariable } from '@digital-net-org/digital-api-sdk';

export function buildAvailableVariables(variables: TemplateVariable[], query: string): TemplateVariable[] {
    const trimmed = query.trim().toLowerCase();
    if (trimmed === '') return variables;
    return variables.filter(
        v =>
            v.token.toLowerCase().includes(trimmed) ||
            v.source.toLowerCase().includes(trimmed) ||
            v.field.toLowerCase().includes(trimmed)
    );
}
