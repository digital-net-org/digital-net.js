import type React from 'react';
import type { IconButtonProps } from '@digital-net/react-digital-ui';
import { ComponentsTool } from './ComponentsTool';
import { TreeTool } from './TreeTool';

export interface PageTool {
    id: 'tree' | 'components';
    icon: IconButtonProps['icon'];
    component: () => React.JSX.Element;
    isDefault: boolean;
}

export const pageTools: Array<PageTool> = [
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
