import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Entity, PageLight } from '@digital-net/core';
import { Text, Box, Button, Icon } from '@digital-net/react-digital-ui';
import { EditorApiHelper } from '../../state/EditorApiHelper';
import { useStoredEntity } from '../../../../Storage';

interface Props {
    page: PageLight;
    isLoading: boolean;
}

export function EditorNavItem<T extends Entity>({ page, isLoading }: Props) {
    const { storedExists } = useStoredEntity<T>(EditorApiHelper.store, page?.id);
    const navigate = useNavigate();
    const { id } = useParams();
    const selected = React.useMemo(() => id === page.id, [id, page.id]);

    return (
        <Box direction="row" align="center" justify="space-between" fullWidth gap={1}>
            <Button
                variant="icon"
                disabled={isLoading}
                selected={selected}
                fullWidth
                onClick={() =>
                    !isLoading
                        ? navigate({
                              pathname: `${ROUTER_EDITOR}/${page.id}`,
                              search: location.search,
                          })
                        : void 0
                }
            >
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
