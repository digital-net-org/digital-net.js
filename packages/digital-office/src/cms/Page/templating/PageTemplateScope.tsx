import * as React from 'react';
import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { useDnEntityFormContext } from '../../../entity';
import { TemplateVariablesProvider } from './TemplateVariablesContext';

export function PageTemplateScope({ children }: { children: React.ReactNode }) {
    const { values } = useDnEntityFormContext<PageDto>();
    return <TemplateVariablesProvider entityType={values.entityType ?? null}>{children}</TemplateVariablesProvider>;
}
