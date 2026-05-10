import type { TemplateVariable } from '@digital-net-org/digital-api-sdk';

interface InvalidPlaceholder {
    start: number;
    end: number;
    raw: string;
    inner: string;
    message: string;
}

const PLACEHOLDER_REGEX = /\{\{([^{}]*)\}\}/g;
const DOTTED_VARIABLE_REGEX = /^([a-z][a-z0-9_]*)\.([a-z_][a-z0-9_]*)$/;

const buildVariableSet = (variables: TemplateVariable[]) =>
    new Set(variables.map(v => `${v.source.toLowerCase()}.${v.field.toLowerCase()}`));

export function validateInterpolatedString(
    value: string | null | undefined,
    variables: TemplateVariable[]
): InvalidPlaceholder[] {
    if (!value || value.length === 0) {
        return [];
    }

    const known = buildVariableSet(variables);
    const invalid: InvalidPlaceholder[] = [];

    PLACEHOLDER_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = PLACEHOLDER_REGEX.exec(value)) !== null) {
        const inner = match[1].trim();
        if (inner.length === 0) continue;

        const lower = inner.toLowerCase();
        if (known.has(lower)) continue;

        const dotted = lower.match(DOTTED_VARIABLE_REGEX);
        const message = dotted
            ? `La variable "{{ ${inner} }}" n'existe pas.`
            : `Expression invalide. Format attendu : "{{ source.champ }}".`;

        invalid.push({
            start: match.index,
            end: match.index + match[0].length,
            raw: match[0],
            inner,
            message,
        });
    }

    return invalid;
}
