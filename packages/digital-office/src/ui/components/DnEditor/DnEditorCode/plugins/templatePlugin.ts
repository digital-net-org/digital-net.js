import type { TemplateVariable } from '@digital-net-org/digital-api-sdk';
import { createTemplateCompleter } from '../aceTemplateCompleter';
import { validateInterpolatedString } from '../../../DnInput/utils/interpolated';
import type { EditorPlugin } from './types';

export function templatePlugin(variables: TemplateVariable[]): EditorPlugin {
    return {
        id: 'template',
        validate: value =>
            validateInterpolatedString(value, variables).map(err => ({
                start: err.start,
                end: err.end,
                message: err.message,
                className: 'dn-template-error',
            })),
        completers: [createTemplateCompleter(variables)],
        autocompleteTriggers: [{ pattern: '{{' }],
    };
}
