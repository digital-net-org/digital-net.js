import { type AppAlertsProps } from './AppAlerts/AppAlerts';
import { Localization } from '../Localization';
import { useDigitalApp } from './useDigitalApp';
import { usePuckConfig } from './usePuckConfig';

export function useAppAlerts(): Array<AppAlertsProps['alerts'][number]> {
    const { openAppSettings } = useDigitalApp();
    const { isConfigUploaded, isValidating } = usePuckConfig();

    return [
        ...(!isValidating && isConfigUploaded
            ? []
            : [
                  {
                      key: 'no-frame-config',
                      title: Localization.translate('app:alerts.errors.noFrameValidation.noFrame'),
                      message: Localization.translate('app:alerts.errors.noFrameValidation.action'),
                      onClick: () => openAppSettings('pages-puck'),
                  },
              ]),
    ];
}
