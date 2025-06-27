import React from 'react';
import type { PageMeta } from '@digital-net/core';
import { Box, IconButton, InputSelect, InputText } from '@digital-net/react-digital-ui';
import { baseFieldsClassName } from './PuckPanelFields';

interface MetaFieldProps {
    meta: PageMeta;
    onDelete: (meta: PageMeta) => void;
    onUpdate: (meta: PageMeta) => void;
}

export function MetaField({ meta, onDelete, onUpdate }: MetaFieldProps) {
    const [key, setKey] = React.useState<string>(meta.key);
    const [value, setValue] = React.useState<string>(meta.value);
    const [content, setContent] = React.useState<string>(meta.content);

    const handleUpdate = (payload: Partial<PageMeta>) => onUpdate({ ...meta, ...payload });
    const handleDelete = () => onDelete(meta);

    React.useEffect(() => {
        setKey(meta.key);
        setValue(meta.value);
        setContent(meta.content);
    }, [meta]);

    return (
        <Box direction="row" gap={1} align="start" justify="space-between" fullWidth fullHeight>
            <Box gap={1} fullWidth>
                <Box className={`${baseFieldsClassName}-Meta`} direction="row" gap={1} align="start" fullWidth>
                    <InputSelect
                        label="key"
                        value={key}
                        options={['name', 'property']}
                        onChange={v => {
                            if (!v) return;
                            setKey(v);
                            handleUpdate({ key: v });
                        }}
                        onRender={t => t}
                        required
                    />
                    <InputText
                        label={key ?? 'name'}
                        value={value}
                        maxLength={128}
                        onChange={v => {
                            if (!v) return;
                            setValue(v);
                            handleUpdate({ value: v });
                        }}
                        fullWidth
                    />
                </Box>
                <InputText
                    label="content"
                    type="area"
                    value={content}
                    maxLength={256}
                    onChange={v => {
                        if (!v) return;
                        setContent(v);
                        handleUpdate({ content: v });
                    }}
                    fullWidth
                />
            </Box>
            <Box className={`${baseFieldsClassName}-Meta-Actions`} mt={2} gap={1} align="center" justify="center">
                <IconButton icon="TrashIcon" onClick={handleDelete} />
            </Box>
        </Box>
    );
}
