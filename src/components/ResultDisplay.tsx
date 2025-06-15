import React from 'react';

interface ResultDisplayProps {
    label: string;
    description: string;
    isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ label, description, isLoading }) => {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Classification Result</h2>
            <p><strong>Label:</strong> {label}</p>
            <p><strong>Description:</strong> {description}</p>
        </div>
    );
};

export default ResultDisplay;