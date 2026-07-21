import type { Ace } from 'ace-builds';
import type { DnEditorCodeProps } from '../DnEditorCode';

const aceModesMap: Record<DnEditorCodeProps['language'], string> = {
    javascript: 'javascript',
    html: 'html',
    css: 'css',
    json: 'json',
    jsonld: 'json',
};

export function resolveEditorLanguage(editor: Ace.Editor, language: DnEditorCodeProps['language']) {
    editor.session.setMode(`ace/mode/${aceModesMap[language]}`);
}
