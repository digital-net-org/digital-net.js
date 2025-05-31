import { ComponentsTool } from './ComponentsTool';
import { TreeTool } from './TreeTool';
import type { IconButtonProps } from '@digital-net/react-digital-ui';
import type React from 'react';

export interface FrameTool {
    id: 'tree' | 'components';
    icon: IconButtonProps['icon'];
    component: () => React.JSX.Element;
    isDefault: boolean;
}

export const frameTools: Array<FrameTool> = [
    {
        id: 'components' as const,
        icon: 'DiamondIcon' as const,
        component: ComponentsTool,
        isDefault: true,
    },
    {
        id: 'tree' as const,
        icon: 'DiagramIcon' as const,
        component: TreeTool,
        isDefault: false,
    },
];
