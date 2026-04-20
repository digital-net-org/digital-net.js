import * as React from 'react';
import { FormControl, FormControlLabel, FormHelperText, Stack } from '@mui/material';
import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { DnInput, DnSwitch } from '../../ui';
import { QuestionMark as InfoIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export interface PageEditTabGeneralProps {
    page: PageDto | undefined;
    isNew: boolean;
}

const helperTexts = {
    path: "Chemin d'acces vers la page depuis le site client.",
    title: "Titre affiché dans l'onglet du navigateur et dans les resultats des moteurs de recherche.",
    description:
        'Description courte affichée dans les résultats des moteurs de recherche. Limitée à 160 caractères idéalement.',
    redirect: "Si renseigné, redirige les visiteurs vers cette URL au lieu d'afficher la page.",
    published: 'Si activée, la page est accessible aux visiteurs du site. Sinon elle reste en brouillon.',
    indexed: "Autorise les moteurs de recherche à référencer cette page. Désactiver pour l'exclure du référencement.",
};

export function PageEditTabGeneral({ page, isNew }: PageEditTabGeneralProps) {
    return (
        <Stack spacing={2} sx={{ maxWidth: 720 }}>
            <DnInput
                label="Chemin"
                value={page?.path ?? ''}
                disabled
                fullWidth
                placeholder={isNew ? '/ma-nouvelle-page' : undefined}
                helperText={helperTexts.path}
            />
            <DnInput label="Titre" value={page?.title ?? ''} helperText={helperTexts.title} fullWidth />
            <DnInput
                label="Description"
                value={page?.description ?? ''}
                disabled
                fullWidth
                multiline
                rows={3}
                helperText={helperTexts.description}
            />
            <DnInput
                label="Redirection"
                value={page?.redirect ?? ''}
                disabled
                fullWidth
                helperText={helperTexts.redirect}
            />
            <FormControl>
                <FormControlLabel control={<DnSwitch checked={page?.published ?? false} disabled />} label="Publiée" />
                <FormHelperText>{helperTexts.published}</FormHelperText>
            </FormControl>
            <FormControl>
                <FormControlLabel control={<DnSwitch checked={page?.indexed ?? true} disabled />} label="Indexée" />
                <FormHelperText>{helperTexts.indexed}</FormHelperText>
            </FormControl>
        </Stack>
    );
}
