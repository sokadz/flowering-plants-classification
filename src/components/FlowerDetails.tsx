import React, { useState, useEffect } from 'react';
import { getCompletePlantInfo } from '../services/plantInfoService';
import { CompletePlantInfo } from '../types/flowers';
import './FlowerDetails.css';

interface PlantDetailsProps {
    classId: number;
    confidence: number;
}

export const PlantDetails: React.FC<PlantDetailsProps> = ({ classId, confidence }) => {
    const [plantInfo, setPlantInfo] = useState<CompletePlantInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlantInfo = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const info = await getCompletePlantInfo(classId);
                setPlantInfo(info);
            } catch (err) {
                setError('Failed to load plant information');
                console.error('Error fetching plant info:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlantInfo();
    }, [classId]);

    if (loading) {
        return (
            <div className="plant-details loading">
                <div className="loading-spinner"></div>
                <p>Loading plant information...</p>
            </div>
        );
    }

    if (error || !plantInfo) {
        return (
            <div className="plant-details error">
                <p>❌ {error || 'Plant information not available'}</p>
            </div>
        );
    }

    return (
        <div className="plant-details">
            {/* Classification Result */}
            <div className="classification-result">
                <h3>🌸 Classification Result</h3>
                <div className="result-info">
                    <h4>{plantInfo.name}</h4>
                    <p className="scientific-name"><em>{plantInfo.scientificName}</em></p>
                    <p className="confidence">
                        <strong>Confidence: {(confidence * 100).toFixed(1)}%</strong>
                    </p>
                    {plantInfo.isFromWikipedia && (
                        <p className="data-source">📖 Enhanced with Wikipedia data</p>
                    )}
                </div>
            </div>

            {/* Plant Image from Wikipedia */}
            {plantInfo.wikipediaInfo?.image && (
                <div className="plant-image">
                    <img 
                        src={plantInfo.wikipediaInfo.image} 
                        alt={plantInfo.name}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Description */}
            <div className="plant-description">
                <h4>📝 Description</h4>
                <p>{plantInfo.description}</p>
            </div>


            {/* Scientific Classification - Dynamic dari Wikipedia */}
            <div className="scientific-classification">
                <h4>🧬 Scientific Classification</h4>
                <div className="classification-table">
                    <div className="classification-row">
                        <span className="classification-label">Kingdom:</span>
                        <span className="classification-value">{plantInfo.kingdom}</span>
                    </div>
                    
                    {/* Dynamic Clades */}
                    {plantInfo.clades && plantInfo.clades.map((clade, index) => (
                        <div key={index} className="classification-row">
                            <span className="classification-label">Clade:</span>
                            <span className="classification-value">{clade}</span>
                        </div>
                    ))}
                    
                    {plantInfo.order && (
                        <div className="classification-row">
                            <span className="classification-label">Order:</span>
                            <span className="classification-value">{plantInfo.order}</span>
                        </div>
                    )}
                    
                    {plantInfo.family && (
                        <div className="classification-row">
                            <span className="classification-label">Family:</span>
                            <span className="classification-value">{plantInfo.family}</span>
                        </div>
                    )}
                    
                    {plantInfo.subfamily && (
                        <div className="classification-row">
                            <span className="classification-label">Subfamily:</span>
                            <span className="classification-value">{plantInfo.subfamily}</span>
                        </div>
                    )}
                    
                     <div className="classification-row">
                        <span className="classification-label">Genus:</span>
                        <span className="classification-value"><em>{plantInfo.genus}</em></span>
                    </div>
                    
                    <div className="classification-row">
                        <span className="classification-label">Species:</span>
                        <span className="classification-value"><em>{plantInfo.species}</em></span>
                    </div>
                </div>
            </div>

            {/* Characteristics */}
            {plantInfo.characteristics.length > 0 && (
                <div className="characteristics">
                    <h4>✨ Characteristics</h4>
                    <ul>
                        {plantInfo.characteristics.map((char, index) => (
                            <li key={index}>{char}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Wikipedia Link */}
            {plantInfo.wikipediaInfo?.url && (
                <div className="wiki-link">
                    <a 
                        href={plantInfo.wikipediaInfo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="wiki-button"
                    >
                        📖 Read more on Wikipedia
                    </a>
                </div>
            )}
        </div>
    );
};