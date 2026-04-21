import prettier from 'prettier/standalone';
import pluginBabel from 'prettier/plugins/babel';
import pluginEstree from 'prettier/plugins/estree';
import pluginHtml from 'prettier/plugins/html';
import pluginCss from 'prettier/plugins/postcss';
import type { DnCodeEditorLanguage } from './DnCodeEditor';

const parserMap: Record<DnCodeEditorLanguage, string> = {
    javascript: 'babel',
    html: 'html',
    css: 'css',
    json: 'json',
};

export async function formatCode(source: string, language: DnCodeEditorLanguage): Promise<string> {
    if (!source.trim()) return source;
    try {
        return await prettier.format(source, {
            parser: parserMap[language],
            plugins: [pluginBabel, pluginEstree, pluginHtml, pluginCss],
            tabWidth: 4,
            singleQuote: true,
            printWidth: 120,
        });
    } catch (err) {
        console.warn('[DnCodeEditor] Prettier format failed:', err);
        return source;
    }
}
