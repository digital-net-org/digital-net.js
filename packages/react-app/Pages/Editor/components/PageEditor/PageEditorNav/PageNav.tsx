import React from 'react';
import { type PageLight } from '@digital-net/core';
import { Box, IconButton, Text } from '@digital-net/react-digital-ui';
import { Localization } from '../../../../../Localization';
import { PageEditorHelper } from '../PageEditorHelper';
import { PageNavItem } from './PageNavItem';

export interface PageNavProps {
    page: PageLight | undefined;
    pageList: Array<PageLight>;
    onSelect: (id: PageLight['id']) => void;
    onCreate: () => void;
    onClose: () => void;
    isLoading: boolean;
}

export function PageNav({ page, pageList, onSelect, onCreate, onClose, isLoading }: PageNavProps) {
    return (
        <div className={`${PageEditorHelper.className}-Nav`}>
            <div className={`${PageEditorHelper.className}-Nav-Title`}>
                <Text variant="caption">{Localization.translate('page-editor:navigation.title')}</Text>
                <Box direction="row" gap={1}>
                    <IconButton icon="ReloadIcon" onClick={() => PageEditorHelper.invalidateGetAll()} />
                    <IconButton icon="AddIcon" onClick={onCreate} />
                    <IconButton icon="CloseIcon" variant="icon-bordered" onClick={onClose} critical />
                </Box>
            </div>
            <div className={`${PageEditorHelper.className}-Nav-List`}>
                {(pageList ?? []).map(e => (
                    <React.Fragment key={e.id}>
                        <PageNavItem
                            page={e}
                            key={e.id}
                            onSelect={onSelect}
                            selected={e.id === page?.id}
                            isLoading={isLoading}
                        />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
