import type { Entity, PageLight } from '@digital-net/core';
import { Text, Box, Button, Icon } from '@digital-net/react-digital-ui';
import { FrameEditorHelper } from '../FrameEditorHelper';
import { useStoredEntity } from '../../../../../Storage';

interface Props {
    frame: PageLight;
    onSelect: (id: PageLight['id']) => void;
    selected: boolean;
    isLoading: boolean;
}

export function FrameNavItem<T extends Entity>({ frame, onSelect, selected, isLoading }: Props) {
    const { storedExists } = useStoredEntity<T>(FrameEditorHelper.store, frame?.id);
    return (
        <Box direction="row" align="center" justify="space-between" fullWidth gap={1}>
            <Button
                variant="icon"
                disabled={isLoading}
                selected={selected}
                fullWidth
                onClick={() => (!isLoading ? onSelect(frame.id) : void 0)}
            >
                <Box direction="row" justify="space-between" gap={1} fullWidth>
                    <Text>{frame.path}</Text>
                    <Text variant="span" size="small" italic disabled>
                        {frame.version}
                    </Text>
                </Box>
            </Button>
            <Box visible={storedExists}>
                <Icon.CircleFill size="x-small" />
            </Box>
        </Box>
    );
}
