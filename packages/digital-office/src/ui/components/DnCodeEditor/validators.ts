import prettier from 'prettier/standalone';
import pluginBabel from 'prettier/plugins/babel';
import pluginEstree from 'prettier/plugins/estree';
import pluginHtml from 'prettier/plugins/html';
import pluginCss from 'prettier/plugins/postcss';
import type { DnCodeEditorLanguage } from './DnCodeEditor';

export interface CodeAnnotation {
    row: number; // 0-indexed
    column: number; // 0-indexed
    text: string;
    type: 'error' | 'warning' | 'info';
}

const parserMap: Record<DnCodeEditorLanguage, string> = {
    javascript: 'babel',
    html: 'html',
    css: 'css',
    json: 'json',
};

export async function validateCode(source: string, language: DnCodeEditorLanguage): Promise<CodeAnnotation | null> {
    if (!source.trim()) {
        return null;
    }

    try {
        await prettier.format(source, {
            parser: parserMap[language],
            plugins: [pluginBabel, pluginEstree, pluginHtml, pluginCss],
        });
        return null;
    } catch (err) {
        const e = err as {
            loc?: { start?: { line?: number; column?: number } };
            message?: string;
        };

        const line = e.loc?.start?.line ?? 1;
        const column = e.loc?.start?.column ?? 1;
        const message = (e.message ?? 'Erreur de syntaxe').split('\n')[0];

        return {
            row: Math.max(0, line - 1),
            column: Math.max(0, column - 1),
            text: message,
            type: 'error',
        };
    }
}
