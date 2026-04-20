import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import type { DnFilterDefinition } from '../DnEntityTable';
import { DnInput } from '../../DnInput';

const DEBOUNCE_MS = 300;

interface LikeFilterProps {
    filter: Extract<DnFilterDefinition, { type: 'like' }>;
    value: string;
    onChange: (_patch: Record<string, string>) => void;
}

export function LikeFilter({ filter, value, onChange }: LikeFilterProps) {
    const [localValue, setLocalValue] = React.useState(value);
    const [prevValue, setPrevValue] = React.useState(value);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    if (prevValue !== value) {
        setPrevValue(value);
        setLocalValue(value);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setLocalValue(next);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => onChange({ [filter.key]: next }), DEBOUNCE_MS);
    };

    React.useEffect(() => () => (timeoutRef.current ? clearTimeout(timeoutRef.current) : void 0), []);

    return (
        <Stack sx={{ gap: 0.5 }}>
            <Typography variant="caption">{filter.label}</Typography>
            <DnInput value={localValue} placeholder={filter.placeholder} onChange={handleChange} />
        </Stack>
    );
}
