export function formatRegex(pattern: string | RegExp): string | null {
    const source = (typeof pattern === 'string' ? pattern : pattern.source).trim();
    try {
        return describe(source);
    } catch {
        return null;
    }
}

interface Count {
    min: number;
    max: number | null;
}

interface ClassInfo {
    negated: boolean;
    hasLower: boolean;
    hasUpper: boolean;
    hasDigit: boolean;
    hasSpace: boolean;
    symbols: string[];
}

type Category = 'lower' | 'upper' | 'digit' | 'letter' | 'alnum' | 'symbol';

interface Requirement {
    category: Category;
    symbols: string | null;
    count: Count;
}

const CATEGORY_LABELS: Record<Category, { article: string; singular: string; plural: string }> = {
    lower: { article: 'une', singular: 'minuscule', plural: 'minuscules' },
    upper: { article: 'une', singular: 'majuscule', plural: 'majuscules' },
    digit: { article: 'un', singular: 'chiffre', plural: 'chiffres' },
    letter: { article: 'une', singular: 'lettre', plural: 'lettres' },
    alnum: { article: 'un', singular: 'caractère alphanumérique', plural: 'caractères alphanumériques' },
    symbol: { article: 'un', singular: 'symbole', plural: 'symboles' },
};

function describe(source: string): string | null {
    let s = source.startsWith('^') ? source.slice(1) : source;
    const { lookaheads, rest } = extractLeadingLookaheads(s);

    let length: Count | null = null;
    const requirements: Requirement[] = [];
    for (const content of lookaheads) {
        const parsed = parseLookahead(content);
        if (!parsed) continue;
        if (parsed.kind === 'length') length = parsed.count;
        else requirements.push(parsed.req);
    }

    let body = rest;
    if (body.endsWith('$') && !body.endsWith('\\$')) body = body.slice(0, -1);
    const parsedBody = parseBody(body);
    if (parsedBody.length) length = parsedBody.length;
    const allowed = parsedBody.allowed;

    if (!length && !allowed && requirements.length === 0) return null;

    const segments: string[] = [];
    if (length) {
        const suffix = allowed ? allowedSuffix(allowed) : null;
        segments.push(suffix ? `${lengthText(length)} ${suffix}` : lengthText(length));
    } else if (allowed) {
        const suffix = allowedSuffix(allowed);
        if (suffix) segments.push(`caractères ${suffix}`);
    }

    const allAtLeastOne = requirements.length > 0 && requirements.every(r => r.count.min === 1 && r.count.max === null);
    const reqTexts = requirements.map(requirementText);
    if (allAtLeastOne && reqTexts.length > 0) reqTexts[0] = `au moins ${reqTexts[0]}`;
    segments.push(...reqTexts);

    return segments.length > 0 ? joinFr(segments) : null;
}

function extractLeadingLookaheads(src: string): { lookaheads: string[]; rest: string } {
    const lookaheads: string[] = [];
    let i = 0;
    while (src.startsWith('(?=', i)) {
        let depth = 0;
        let j = i;
        for (; j < src.length; j++) {
            const c = src[j];
            if (c === '\\') {
                j++;
                continue;
            }
            if (c === '(') depth++;
            else if (c === ')') {
                depth--;
                if (depth === 0) break;
            }
        }
        lookaheads.push(src.slice(i + 3, j));
        i = j + 1;
    }
    return { lookaheads, rest: src.slice(i) };
}

function parseLookahead(content: string): { kind: 'length'; count: Count } | { kind: 'req'; req: Requirement } | null {
    const lengthMatch = /^\.(\{\d+(?:,\d*)?\})\$?$/.exec(content);
    if (lengthMatch) return { kind: 'length', count: parseQuant(lengthMatch[1]) };

    let inner = content;
    let outerQuant: string | undefined;
    const wrapped = /^\(\?:(.*)\)(\{\d+(?:,\d*)?\}|[*+?])?$/.exec(content);
    if (wrapped) {
        inner = wrapped[1];
        outerQuant = wrapped[2] as string | undefined;
    }

    const classMatch = /^\.[*+]?(\[\^?(?:[^\]\\]|\\.)*\]|\\[dwsDWS]|.)$/.exec(inner);
    if (!classMatch) return null;

    const info = parseClassToken(classMatch[1]);
    const { category, symbols } = classify(info);
    const count: Count = outerQuant ? parseQuant(outerQuant) : { min: 1, max: null };
    return { kind: 'req', req: { category, symbols, count } };
}

function parseBody(body: string): { length: Count | null; allowed: ClassInfo | null } {
    const dot = /^\.(\{\d+(?:,\d*)?\}|[*+?])?$/.exec(body);
    if (dot) {
        const q = dot[1] as string | undefined;
        return { length: q && q.startsWith('{') ? parseQuant(q) : null, allowed: null };
    }
    const singleClass = /^(\[\^?(?:[^\]\\]|\\.)*\]|\\[dwsDWS])(\{\d+(?:,\d*)?\}|[*+?])?$/.exec(body);
    if (singleClass) {
        const q = singleClass[2] as string | undefined;
        return {
            length: q && q.startsWith('{') ? parseQuant(q) : null,
            allowed: parseClassToken(singleClass[1]),
        };
    }
    return { length: null, allowed: null };
}

function parseClassToken(token: string): ClassInfo {
    const info: ClassInfo = {
        negated: false,
        hasLower: false,
        hasUpper: false,
        hasDigit: false,
        hasSpace: false,
        symbols: [],
    };
    const addSymbol = (ch: string) => {
        if (ch === ' ') info.hasSpace = true;
        else if (!info.symbols.includes(ch)) info.symbols.push(ch);
    };
    const applyEscape = (ch: string) => {
        if (ch === 'd') info.hasDigit = true;
        else if (ch === 'w') {
            info.hasLower = info.hasUpper = info.hasDigit = true;
            addSymbol('_');
        } else if (ch === 's') info.hasSpace = true;
        else if (ch === 'D' || ch === 'W' || ch === 'S') info.negated = true;
        else addSymbol(ch);
    };

    if (token.startsWith('\\')) {
        applyEscape(token.slice(1));
        return info;
    }

    let body = token.startsWith('[') ? token.slice(1, -1) : token;
    if (body.startsWith('^')) {
        info.negated = true;
        body = body.slice(1);
    }
    for (let i = 0; i < body.length; i++) {
        const c = body[i];
        if (c === '\\') {
            applyEscape(body[i + 1] ?? '');
            i++;
            continue;
        }
        if (body[i + 1] === '-' && i + 2 < body.length) {
            const start = c;
            const end = body[i + 2];
            if (start === 'a' && end === 'z') info.hasLower = true;
            else if (start === 'A' && end === 'Z') info.hasUpper = true;
            else if (start === '0' && end === '9') info.hasDigit = true;
            else {
                addSymbol(start);
                addSymbol('-');
                addSymbol(end);
            }
            i += 2;
            continue;
        }
        if (c >= 'a' && c <= 'z') info.hasLower = true;
        else if (c >= 'A' && c <= 'Z') info.hasUpper = true;
        else if (c >= '0' && c <= '9') info.hasDigit = true;
        else addSymbol(c);
    }
    return info;
}

function classify(info: ClassInfo): { category: Category; symbols: string | null } {
    if (info.negated) return { category: 'symbol', symbols: null };
    const hasSymbol = info.symbols.length > 0 || info.hasSpace;
    if (hasSymbol && !info.hasLower && !info.hasUpper && !info.hasDigit)
        return { category: 'symbol', symbols: info.symbols.join('') || null };
    if (info.hasLower && info.hasUpper && !info.hasDigit && !hasSymbol) return { category: 'letter', symbols: null };
    if (info.hasLower && !info.hasUpper && !info.hasDigit && !hasSymbol) return { category: 'lower', symbols: null };
    if (info.hasUpper && !info.hasLower && !info.hasDigit && !hasSymbol) return { category: 'upper', symbols: null };
    if (info.hasDigit && !info.hasLower && !info.hasUpper && !hasSymbol) return { category: 'digit', symbols: null };
    if ((info.hasLower || info.hasUpper) && info.hasDigit && !hasSymbol) return { category: 'alnum', symbols: null };
    return { category: 'symbol', symbols: info.symbols.join('') || null };
}

function parseQuant(q: string | undefined): Count {
    if (!q) return { min: 1, max: 1 };
    if (q === '+') return { min: 1, max: null };
    if (q === '*') return { min: 0, max: null };
    if (q === '?') return { min: 0, max: 1 };
    const m = /^\{(\d+)(?:(,)(\d*))?\}$/.exec(q);
    if (!m) return { min: 1, max: 1 };
    const min = Number(m[1]);
    const comma = m[2] as string | undefined;
    const maxStr = m[3] as string | undefined;
    if (comma === undefined) return { min, max: min };
    if (maxStr === undefined || maxStr === '') return { min, max: null };
    return { min, max: Number(maxStr) };
}

function lengthText(c: Count): string {
    const noun = (n: number) => (n > 1 ? 'caractères' : 'caractère');
    if (c.max === null) return `au moins ${c.min} ${noun(c.min)}`;
    if (c.min === c.max) return `exactement ${c.min} ${noun(c.min)}`;
    if (c.min <= 0) return `au plus ${c.max} ${noun(c.max)}`;
    return `entre ${c.min} et ${c.max} caractères`;
}

function requirementText(req: Requirement): string {
    const cat = CATEGORY_LABELS[req.category];
    const lead = countLead(req.count);
    const core =
        lead.text === '' ? `${cat.article} ${cat.singular}` : `${lead.text} ${lead.plural ? cat.plural : cat.singular}`;
    return req.symbols ? `${core} parmi ${req.symbols}` : core;
}

function countLead(c: Count): { text: string; plural: boolean } {
    if (c.min === 1 && c.max === null) return { text: '', plural: false };
    if (c.max === null) return { text: `au moins ${c.min}`, plural: c.min > 1 };
    if (c.min === c.max) return { text: `exactement ${c.min}`, plural: c.min > 1 };
    if (c.min <= 0) return { text: `au plus ${c.max}`, plural: c.max > 1 };
    return { text: `entre ${c.min} et ${c.max}`, plural: c.max > 1 };
}

function allowedSuffix(info: ClassInfo): string | null {
    const items: string[] = [];
    if (info.hasLower && info.hasUpper) items.push('lettres');
    else if (info.hasLower) items.push('minuscules');
    else if (info.hasUpper) items.push('majuscules');
    if (info.hasDigit) items.push('chiffres');
    if (info.hasSpace) items.push('espace');
    items.push(...info.symbols);
    return items.length > 0 ? `(${joinFr(items)})` : null;
}

function joinFr(parts: string[]): string {
    if (parts.length <= 1) return parts[0] ?? '';
    return `${parts.slice(0, -1).join(', ')} et ${parts[parts.length - 1]}`;
}
