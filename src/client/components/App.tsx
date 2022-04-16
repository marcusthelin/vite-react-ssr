import React from 'react';

const Child: React.FC = () => {
    return <p>asdasdasd</p>;
};

const Later = React.lazy(() => import('./Later'));

const App: React.FC = () => {
    return (
        <>
            <Child />
            <React.Suspense fallback={<p>Loading....</p>}>
                <Later />
            </React.Suspense>
        </>
    );
};

export default App;
