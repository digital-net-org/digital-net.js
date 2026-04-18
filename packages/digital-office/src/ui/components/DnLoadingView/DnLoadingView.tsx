import { CircularProgress } from '@mui/material';

export function DnLoadingView() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <CircularProgress />
        </div>
    );
}
