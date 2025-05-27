import * as React from 'react';

export default function ErrorView(props: { error: '404' }) {
    if (props.error === '404') {
        return <React.Fragment>NOT FOUND</React.Fragment>;
    } else {
        return <React.Fragment>UNHANDLED ERROR</React.Fragment>;
    }
}
