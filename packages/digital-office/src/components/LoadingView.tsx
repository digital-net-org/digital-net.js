import { CircularProgress } from '@mui/material';

/**
 * Full-page centered loading spinner.
 * Displayed while the application is initializing (e.g. restoring a session).
 */
export function LoadingView() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100vh',
            }}
        >
            <CircularProgress />
        </div>
    );
}
