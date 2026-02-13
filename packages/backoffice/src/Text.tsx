import React from 'react';

export function Test() {
    const [state, setState] = React.useState('');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
            <pre>{state}</pre>
        </div>
    );
}
