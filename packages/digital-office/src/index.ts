import { useDnApi } from './api';
import { useDnEntityFormContext } from './entity';

export * from './ui';
export * from './storage';
export { useLayout, useDnToast, useDigitalNetUser } from './app';

export { DigitalOfficeRouter } from './router';
export { DigitalOfficeProvider, type DigitalOfficeProviderProps } from './DigitalOfficeProvider';
export { DigitalOfficeNavGroup, type DigitalOfficeRoute, type DigitalOfficeRouterProps } from './router';

export { DnEntityListView, type DnEntityListViewProps, useEntitySchema } from './entity';
export { MediaPicker, type MediaPickerProps, useMediaPivot } from './cms/Media';
export { CustomRenderProvider, useCustomNode, type DnCustomView } from './custom-render';

/** Returns the Digital API instance. **/
export const useDigitalApi = () => useDnApi();

export const useEntityForm = useDnEntityFormContext;
