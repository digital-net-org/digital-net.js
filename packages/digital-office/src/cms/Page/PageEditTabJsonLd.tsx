import * as React from 'react';
import { Alert as MuiAlert, Stack } from '@mui/material';
import { styled, css } from '@mui/material/styles';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { useDnEntityFormContext } from '../../entity';
import { DnButton, DnCodeEditor, type DnCodeEditorCompletion } from '../../ui';

const JSON_LD_DOC_URL = 'https://developers.google.com/search/docs/appearance/structured-data/search-gallery';
const JSON_LD_TEST_URL = 'https://search.google.com/test/rich-results';

const JSON_LD_COMPLETIONS: DnCodeEditorCompletion[] = [
    {
        value: '@context',
        meta: 'JSON-LD',
        description: 'Contexte de vocabulaire.',
        values: [{ value: 'https://schema.org', meta: 'URL' }],
    },
    {
        value: '@type',
        meta: 'JSON-LD',
        description: 'Type de schéma.',
        values: [
            { value: 'Article', meta: 'Schema.org' },
            { value: 'Product', meta: 'Schema.org' },
            { value: 'Organization', meta: 'Schema.org' },
            { value: 'WebSite', meta: 'Schema.org' },
            { value: 'WebPage', meta: 'Schema.org' },
        ],
    },
];

export function PageEditTabJsonLd() {
    const { values, setField, disabled } = useDnEntityFormContext<PageDto>();
    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <Alert severity="info" variant="outlined">
                <Stack direction="row" sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack>Définissez les résultats enrichis de votre page.</Stack>
                    <Stack direction="row" sx={{ gap: 2 }}>
                        <ExternalButton link={JSON_LD_DOC_URL}>Documentation</ExternalButton>
                        <ExternalButton link={JSON_LD_TEST_URL}>Tester mon JSON</ExternalButton>
                    </Stack>
                </Stack>
            </Alert>
            <Stack sx={{ flex: 1, minHeight: 0 }}>
                <DnCodeEditor
                    value={values.jsonLd ?? ''}
                    onChange={value => setField('/jsonLd', value)}
                    language="json"
                    disabled={disabled}
                    completions={JSON_LD_COMPLETIONS}
                />
            </Stack>
        </Stack>
    );
}

function ExternalButton({ link, children }: { link: string; children?: React.ReactNode }) {
    return (
        <DnButton
            variant="outlined"
            icon={<OpenInNewIcon fontSize="small" />}
            onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        >
            {children}
        </DnButton>
    );
}

const Alert = styled(MuiAlert)(
    () => css`
        & .MuiAlert-message {
            width: 100%;
        }
        & .MuiAlert-icon {
            padding: 0;
            align-items: center;
        }
    `
);
