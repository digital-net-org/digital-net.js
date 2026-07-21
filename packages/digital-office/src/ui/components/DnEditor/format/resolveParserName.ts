import type { DnEditorCodeProps } from '../DnEditorCode/DnEditorCode';

const parserMap: Record<DnEditorCodeProps['language'], string> = {
    javascript: 'babel',
    html: 'html',
    css: 'css',
    json: 'json',
    jsonld: 'json',
};

export const resolveParserName = (str: DnEditorCodeProps['language']) => parserMap[str];
