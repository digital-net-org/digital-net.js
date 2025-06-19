import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PageLight } from '@digital-net/core';
import { Text, Box, Button, Icon } from '@digital-net/react-digital-ui';
import { useEditorContext, useIsPageModified } from '../../state';

interface Props {
    page: PageLight;
    isLoading: boolean;
}

export function EditorNavItem({ page, isLoading }: Props) {
    const { toggleLayoutLoading } = useEditorContext();
    const { id: currentPageId } = useParams();
    const { isModified } = useIsPageModified(page.id);
    const navigate = useNavigate();
    const selected = React.useMemo(() => currentPageId === page.id, [currentPageId, page.id]);

    const handleClick = React.useCallback(() => {
        const slug = currentPageId === page.id ? '' : `/${page.id}`;
        navigate({
            pathname: `${ROUTER_EDITOR}${slug}`,
            search: location.search,
        });
        if (slug.length !== 0 && currentPageId) {
            toggleLayoutLoading();
        }
    }, [currentPageId, navigate, page.id, toggleLayoutLoading]);

    return (
        <Box direction="row" align="center" justify="space-between" fullWidth gap={1}>
            <Button variant="icon" disabled={isLoading} selected={selected} onClick={handleClick} fullWidth>
                <Box direction="row" justify="space-between" gap={1} fullWidth>
                    <Text>{page.path}</Text>
                </Box>
            </Button>
            <Box visible={isModified}>
                <Icon.CircleFill size="x-small" />
            </Box>
        </Box>
    );
}
