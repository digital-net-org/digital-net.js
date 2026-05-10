import prettier from 'prettier/standalone';
import pluginBabel from 'prettier/plugins/babel';
import pluginEstree from 'prettier/plugins/estree';
import pluginHtml from 'prettier/plugins/html';
import pluginCss from 'prettier/plugins/postcss';
import type { DnInputCodeProps } from '../DnInputCode';
import { resolveParserName } from './resolveParserName';

export async function formatCode(source: string, language: DnInputCodeProps['language']): Promise<string> {
    if (!source.trim()) return source;
    try {
        return await prettier.format(source, {
            parser: resolveParserName(language),
            plugins: [pluginBabel, pluginEstree, pluginHtml, pluginCss],
            tabWidth: 4,
            singleQuote: true,
            printWidth: 120,
        });
    } catch (err) {
        console.warn('[DnInputCode] Prettier format failed:', err);
        return source;
    }
}
