import type { Ace } from 'ace-builds';
import type { DnInputCodeProps } from '../DnInputCode';

const aceModesMap: Record<DnInputCodeProps['language'], string> = {
    javascript: 'javascript',
    html: 'html',
    css: 'css',
    json: 'json',
    jsonld: 'json',
};

export function resolveEditorLanguage(editor: Ace.Editor, language: DnInputCodeProps['language']) {
    editor.session.setMode(`ace/mode/${aceModesMap[language]}`);
}
