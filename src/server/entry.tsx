// @ts-ignore
import React from 'react';
import { renderToString, renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'stream';
import App from '../client/components/App';

const Entry: React.FC = () => {
    return (
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
};

export function render() {
    const passThrough = new PassThrough();
    let didError = false;
    const stream = renderToPipeableStream(<Entry />, {
        onShellReady() {
            // If something errored before we started streaming, we set the error code appropriately.
            stream.pipe(passThrough);
        },
    });
    return passThrough;
    // return renderToString(<App />);
}
