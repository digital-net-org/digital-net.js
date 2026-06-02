import * as React from 'react';
import type { TagDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityForm, type DnEntityFormProps, useDnEntityFormContext, useEntitySchema } from '../../entity';
import { DnEntityAuditBlock } from '../../entity/DnEntityAuditBlock';

const fieldProps: DnEntityFormProps['fieldProps'] = {
    Name: {
        label: 'Nom',
        helperText: 'Identifiant lisible du tag.',
    },
    Color: {
        label: 'Couleur',
        helperText: 'Code couleur du tag, par exemple `#ff00aa`.',
    },
};

export function TagFormGeneral() {
    const { schemas } = useEntitySchema('tag');
    const { values, setField, errors, disabled } = useDnEntityFormContext<TagDto>();

    return (
        <React.Fragment>
            <DnEntityForm
                schemas={schemas}
                fieldProps={fieldProps}
                values={values}
                onFieldChange={setField}
                errors={errors}
                disabled={disabled}
            />
            <DnEntityAuditBlock entity={values} />
        </React.Fragment>
    );
}
