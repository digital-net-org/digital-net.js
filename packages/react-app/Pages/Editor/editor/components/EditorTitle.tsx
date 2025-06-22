import React from 'react';
import { Box, Icon, InputText, Loader, Text } from '@digital-net/react-digital-ui';
import { useEditorContext, usePageStore } from '../../state';
import { EditorHelper } from '../EditorHelper';

export function EditorTitle() {
    const { page, isLayoutLoading, isModified } = useEditorContext();
    const { save } = usePageStore();

    const [edit, setEdit] = React.useState(false);
    const [path, setPath] = React.useState<string | undefined>(page?.path);

    React.useEffect(() => setPath(page?.path), [page?.id, page?.path]);

    const handleChange = (value: string | undefined) => {
        if (!value || value.length === 0) {
            return setPath('/');
        }
        if (!value.startsWith('/')) {
            return setPath(`/${value}`);
        }
        setPath(value);
    };

    const handleUpdate = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (path !== page?.path) {
            await save(page?.id, prev => ({ ...page, ...prev, path }));
        }
        setEdit(false);
    };

    const handleCancel = () => {
        setEdit(false);
        setPath(page?.path);
    };

    return (
        <div className={`${EditorHelper.className}-ToolBar-Title`}>
            {page?.path && !isLayoutLoading ? (
                <Box direction="row" align="center" gap={1}>
                    {edit ? (
                        <form onSubmit={handleUpdate}>
                            <InputText
                                value={path}
                                onEsc={handleCancel}
                                onBlur={handleUpdate}
                                onChange={handleChange}
                                focusOnMount
                            />
                        </form>
                    ) : (
                        <Box
                            className={`${EditorHelper.className}-ToolBar-Title-Input`}
                            direction="row"
                            align="center"
                            onDoubleClick={() => setEdit(true)}
                        >
                            <Text variant="span">{path ?? page?.path}</Text>
                        </Box>
                    )}
                    <Box visible={isModified}>
                        <Icon.CircleFill size="x-small" />
                    </Box>
                </Box>
            ) : null}
            {isLayoutLoading ? (
                <Box pb={1}>
                    <Loader size="small" />
                </Box>
            ) : null}
        </div>
    );
}
