import React from 'react';
import { Button, Stack } from '@mui/material';

export function Test() {
    const [state, setState] = React.useState('');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
            <Stack gap={2}>
                <Button onClick={() => setState('OHLOLOLO!')}>CLICK</Button>
                <pre>{state}</pre>
            </Stack>
        </div>
    );
}
