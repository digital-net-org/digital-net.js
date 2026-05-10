import type { DnInputCodeProps } from '../DnInputCode';

const parserMap: Record<DnInputCodeProps['language'], string> = {
    javascript: 'babel',
    html: 'html',
    css: 'css',
    json: 'json',
    jsonld: 'json',
};

export const resolveParserName = (str: DnInputCodeProps['language']) => parserMap[str];
