import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityForm, useDnEntityFormContext, useEntitySchema } from '../../entity';

export interface PageEditTabGeneralProps {
    isNew: boolean;
}

const staticProps: Record<string, { label: string; helperText: string }> = {
    Path: {
        label: 'Chemin',
        helperText: "Chemin d'acces vers la page depuis le site client.",
    },
    Title: {
        label: 'Titre',
        helperText: "Titre affiché dans l'onglet du navigateur et dans les resultats des moteurs de recherche.",
    },
    Description: {
        label: 'Description',
        helperText:
            'Description courte affichée dans les résultats des moteurs de recherche. Limitée à 160 caractères idéalement.',
    },
    Redirect: {
        label: 'Redirection',
        helperText: "Si renseigné, redirige les visiteurs vers cette URL au lieu d'afficher la page.",
    },
    Published: {
        label: 'Publiée',
        helperText: 'Si activée, la page est accessible aux visiteurs du site. Sinon elle reste en brouillon.',
    },
    Indexed: {
        label: 'Indexée',
        helperText:
            "Autorise les moteurs de recherche à référencer cette page. Désactiver pour l'exclure du référencement.",
    },
};

export function PageEditTabGeneral({ isNew: _isNew }: PageEditTabGeneralProps) {
    const { schemas } = useEntitySchema('page');
    const { values, setField, errors, disabled } = useDnEntityFormContext<PageDto>();
    return (
        <DnEntityForm
            schemas={schemas}
            staticProps={staticProps}
            values={values as Record<string, unknown>}
            onFieldChange={setField}
            errors={errors}
            disabled={disabled}
        />
    );
}
