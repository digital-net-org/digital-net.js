const TRIGGER = '{';

export function buildTemplateContext(value: string, caret: number) {
    const before = value.slice(0, caret);
    let start = before.lastIndexOf(TRIGGER);
    if (start === -1) return null;
    const close = before.indexOf('}', start);
    if (close !== -1 && close < caret) return null;

    // Walk backwards across consecutive `{` so `start` lands on the very first opener.
    while (start > 0 && before[start - 1] === TRIGGER) start--;
    const query = before.slice(start).replace(/^\{+\s*/, '');
    return { start, query };
}
