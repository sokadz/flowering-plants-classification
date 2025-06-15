import React from 'react';
import { Loader as MantineLoader } from '@mantine/core';

const Loader: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <MantineLoader size="xl" />
        </div>
    );
};

export default Loader;