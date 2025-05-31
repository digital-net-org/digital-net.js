import React from 'react';
import { FrameConfigContext } from './FrameConfigContext';

export function useFrameConfig() {
    return React.useContext(FrameConfigContext);
}
