import React from 'react';
import { Puck } from '@measured/puck';
import { BaseTool, baseToolClassName } from './BaseTool';
import { Localization } from '@digital-net/react-app';

export function ToolComponents() {
    return (
        <BaseTool title={Localization.translate('page-editor:tools.components.title')}>
            <div className={`${baseToolClassName}-Components`}>
                <Puck.Components />
            </div>
        </BaseTool>
    );
}
