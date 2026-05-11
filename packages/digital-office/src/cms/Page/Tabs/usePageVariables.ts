import type { PageDto, PageEntityType } from '@digital-net-org/digital-api-sdk';
import { type DnEntityVariableKey, useDnEntityFormContext, useEntityVariables } from '../../../entity';

const PAGE_ENTITY_KEY: Record<PageEntityType, DnEntityVariableKey> = {
    Article: 'page:article',
};

export function usePageVariables() {
    const { values } = useDnEntityFormContext<PageDto>();
    const { variables } = useEntityVariables(values.entityType ? PAGE_ENTITY_KEY[values.entityType] : null);
    return variables;
}
