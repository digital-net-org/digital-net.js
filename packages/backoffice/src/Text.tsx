import React from 'react';

export function Test() {
    const [state, setState] = React.useState('');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
            <dn-input-switch onChange={e => console.log(e.currentTarget.value)} />
            <dn-input-text disabled value={state} label="truc" onChange={e => setState(e.target.value)} />
            <pre>{state}</pre>
        </div>
    );
}
