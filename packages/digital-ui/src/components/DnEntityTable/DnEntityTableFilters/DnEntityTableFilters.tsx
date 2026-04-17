import { css, styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import type { DnFilterDefinition } from '../DnEntityTable';
import { DnButton } from '../../DnButton';
import { BooleanFilter } from './BooleanFilter';
import { SelectFilter } from './SelectFilter';
import { LikeFilter } from './LikeFilter';

interface DnEntityTableFiltersProps {
    filters: DnFilterDefinition[];
    values: Record<string, string>;
    onChange: (patch: Record<string, string>) => void;
    onReset: () => void;
}

export function DnEntityTableFilters({ filters, values, onChange, onReset }: DnEntityTableFiltersProps) {
    return (
        <Root gap={1.5}>
            {filters.map(filter => {
                const value = values[filter.key] ?? '';
                if (filter.type === 'boolean')
                    return <BooleanFilter key={filter.key} filter={filter} value={value} onChange={onChange} />;
                if (filter.type === 'select')
                    return <SelectFilter key={filter.key} filter={filter} value={value} onChange={onChange} />;
                return <LikeFilter key={filter.key} filter={filter} value={value} onChange={onChange} />;
            })}
            <DnButton
                onClick={onReset}
                disabled={Object.values(values).filter(Boolean).length < 1}
                sx={{ width: '100%' }}
            >
                Réinitialiser
            </DnButton>
        </Root>
    );
}

const Root = styled(Stack)(
    ({ theme }) => css`
        padding: ${theme.spacing(2)};
        min-width: 260px;
    `
);
