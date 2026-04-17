import * as React from 'react';
import { Typography } from '@mui/material';
import { type EntityIdentifier, resolveDeleteLabel, resolveNextLabel } from './identifier';

interface DnEntityFailureDialogContentProps {
    failureDialog: { failures: { name: string | undefined }[]; total: number };
    identifier: EntityIdentifier;
}

export function DnEntityFailureDialogContent({ failureDialog, identifier }: DnEntityFailureDialogContentProps) {
    const successCount = failureDialog.total - failureDialog.failures.length;
    const pluralTotal = failureDialog.total > 1;
    const pluralFailures = failureDialog.failures.length > 1;
    const headerNoun = pluralTotal ? identifier.plural : identifier.singular;
    const headerNounCapitalized = headerNoun.charAt(0).toUpperCase() + headerNoun.slice(1);

    return (
        <React.Fragment>
            <Typography>
                {headerNounCapitalized} {resolveDeleteLabel(identifier.gender, pluralTotal)} {successCount}/
                {failureDialog.total}
            </Typography>
            <Typography sx={{ mt: 1 }}>
                Les {identifier.plural} {resolveNextLabel(identifier.gender, pluralFailures)} n&apos;ont pas pu être{' '}
                {resolveDeleteLabel(identifier.gender, pluralFailures)} :
            </Typography>
            {failureDialog.failures.map((f, i) => (
                <Typography key={i}>- {f.name ?? '(inconnu)'}</Typography>
            ))}
        </React.Fragment>
    );
}
