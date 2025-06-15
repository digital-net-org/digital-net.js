import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Entity, PageLight } from '@digital-net/core';
import { Text, Box, Button, Icon } from '@digital-net/react-digital-ui';
import { useStoredEntity } from '../../../../Storage';
import { EditorApiHelper } from '../../state';

interface Props {
    page: PageLight;
    isLoading: boolean;
}

export function EditorNavItem<T extends Entity>({ page, isLoading }: Props) {
    const { id: currentPageId } = useParams();
    const { storedExists } = useStoredEntity<T>(EditorApiHelper.store, page?.id);
    const navigate = useNavigate();
    const selected = React.useMemo(() => currentPageId === page.id, [currentPageId, page.id]);

    const handleClick = React.useCallback(() => {
        if (isLoading) {
            return;
        }
        navigate({
            pathname: `${ROUTER_EDITOR}${currentPageId === page.id ? '' : `/${page.id}`}`,
            search: location.search,
        });
    }, [currentPageId, isLoading, navigate, page.id]);

    return (
        <Box direction="row" align="center" justify="space-between" fullWidth gap={1}>
            <Button variant="icon" disabled={isLoading} selected={selected} onClick={handleClick} fullWidth>
                <Box direction="row" justify="space-between" gap={1} fullWidth>
                    <Text>{page.path}</Text>
                    <Text variant="span" size="small" italic disabled={!selected}>
                        {page.version}
                    </Text>
                </Box>
            </Button>
            <Box visible={storedExists}>
                <Icon.CircleFill size="x-small" />
            </Box>
        </Box>
    );
}
