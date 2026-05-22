import { useDnApp, useDnToast } from './app';
import { useDnUser } from './user';
import { useDnApi } from './api';
import { DnOfficeRouter } from './router';
import { useDnEntityFormContext } from './entity';

export * from './ui';
export * from './storage';
export { DigitalOfficeProvider, type DigitalOfficeProviderProps } from './DigitalOfficeProvider';
export { AdminGuard, AuthGuard, GuestGuard } from './router';
export { DnEntityListView, type DnEntityListViewProps, useEntitySchema } from './entity';
export { MediaPicker, type MediaPickerProps, useMediaPivot } from './cms/Media';
export {
    DnCustomRenderProvider,
    useCustomNode,
    type DnCustomRenderFn,
    type DnCustomRenderArgs,
    type DnCustomView,
} from './custom-render';

/**
 * Root router for the Office application.
 *
 * Provides a `BrowserRouter` internally.
 *
 * Built-in routes:
 * - `/`      — Home page (authenticated, wrapped in {@link DnAppLayout})
 * - `/login` — Login page (guest-only)
 *
 * Additional `<Route>` elements can be passed as `children`
 * and will be rendered alongside the built-in routes (without guards).
 */
export const DigitalOfficeRouter = DnOfficeRouter;

/** Returns the application state and functions. **/
export const useApplication = () => useDnApp();
/** Returns the application user state and functions. **/
export const useUser = () => useDnUser();
/** Returns the Digital API instance. **/
export const useDigitalApi = () => useDnApi();
/** Returns functions to display global toast notifications. **/
export const useToast = () => useDnToast();

export const useEntityForm = useDnEntityFormContext;
