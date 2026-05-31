import { useDnApp, useDnToast } from './app';
import { useDnUser } from './user';
import { useDnApi } from './api';
import { DnOfficeRouter } from './router';
import { useDnEntityFormContext } from './entity';

export * from './ui';
export * from './storage';
export { DigitalOfficeProvider, type DigitalOfficeProviderProps } from './DigitalOfficeProvider';
export {
    AdminGuard,
    AuthGuard,
    GuestGuard,
    DigitalOfficeNavGroup,
    type DigitalOfficeRoute,
    type DnOfficeRouterProps as DigitalOfficeRouterProps,
} from './router';
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
 * Root router for the Office application. Provides a `BrowserRouter` internally.
 *
 * Consumers add their own pages through the `routes` prop
 * (`DigitalOfficeRoute[]`). Custom routes are always appended **after** the
 * built-in ones and are guarded by default (`AuthGuard`, unless the route sets
 * `isPublic` or `isAdmin`).
 *
 * A custom route shows up in the navigation menu as soon as it declares both
 * `navGroup` and `navLabel`. Use {@link DigitalOfficeNavGroup} to drop the page
 * into an existing group, or pass any new string to create a new group.
 *
 * @example
 * <DigitalOfficeRouter
 *     routes={[
 *         {
 *             path: '/parameters',
 *             navGroup: DigitalOfficeNavGroup.ContentManager,
 *             navLabel: 'Paramétrage',
 *             element: <ParametersView />,
 *         },
 *     ]}
 * />
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
