import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import MyForm from './form';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        invoke('getText', { example: 'my-invoke-variable' }).then(setData);
    }, []);

    return (
        <div>
            <MyForm />
            {data ? data : 'Loading...'}
        </div>
    );
}

export default App;
