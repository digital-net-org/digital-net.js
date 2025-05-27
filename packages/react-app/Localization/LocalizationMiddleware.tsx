import React from 'react';
import Localization from './Localization';

export default function LocalizationMiddleware() {
    React.useEffect(() => Localization.init(), []);
    return <React.Fragment />;
}
