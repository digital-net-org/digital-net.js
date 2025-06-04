import React from 'react';
import { useClassName, useOnClickOutside } from '@digital-net/react-core';
import { Localization } from '@digital-net/react-app';
import { Box, Text, type IconButtonProps, type SafariNodeWithChildren } from '@digital-net/react-digital-ui';
import { Actions } from './Actions';
import './Editor.styles.css';

export interface EditorProps extends SafariNodeWithChildren {
    renderName?: () => React.ReactNode;
    renderPanel?: () => React.ReactNode;
    panelState?: 'open' | 'closed';
    setPanelState?: () => void;
    actions?: Array<IconButtonProps>;
    onSave?: () => void;
    onDelete?: () => void;
    disabled?: boolean;
    loading?: boolean;
    modified?: boolean;
    saved?: boolean;
}

export const baseEditorClassName = 'Editor';

export function Editor({
    id,
    className,
    children,
    modified,
    loading,
    disabled,
    saved,
    actions,
    panelState,
    setPanelState,
    renderName,
    renderPanel,
    onDelete,
    onSave,
}: EditorProps) {
    const resolvedClassname = useClassName({ className }, baseEditorClassName);
    const panelRef = React.useRef<HTMLDivElement>(null);
    useOnClickOutside(panelRef, () => (panelState === 'open' ? setPanelState?.() : undefined));

    return (
        <div id={id} className={resolvedClassname}>
            <div className={`${baseEditorClassName}-ToolBar`}>
                <div className={`${baseEditorClassName}-ToolBar-Custom`}>
                    <Actions
                        actions={[
                            ...(renderPanel
                                ? [
                                      {
                                          onClick: setPanelState,
                                          selected: panelState === 'open',
                                          icon: 'FolderIcon' as const,
                                      },
                                  ]
                                : []),
                        ]}
                    />
                    <Box className="Editor-ToolBar-separator" />
                    {actions && <Actions actions={actions} />}
                </div>
                <div className={`${baseEditorClassName}-ToolBar-Title`}>
                    <Text variant="span">{renderName ? renderName() : null}</Text>
                    <Text variant="span" size="small" italic>
                        {modified ? Localization.translate('global:state.modified') : ''}
                    </Text>
                </div>
                <Actions
                    actions={[
                        {
                            onClick: onSave,
                            icon: 'FloppyIcon',
                            disabled: disabled || loading || !modified,
                        },
                        {
                            onClick: onDelete,
                            icon: 'TrashIcon',
                            disabled: disabled || loading || !saved,
                        },
                    ]}
                />
            </div>
            <div className={`${baseEditorClassName}-Content`}>
                {renderPanel && Boolean(panelState) && (
                    <div ref={panelRef} className={`${baseEditorClassName}-Panel`} data-panel-type={panelState}>
                        {renderPanel()}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
