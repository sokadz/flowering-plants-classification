import React from 'react';
import { MantineProvider } from '@mantine/core';
import ImageUpload from './components/ImageUpload';

function App() {
  const handleImageUpload = (file: File) => {
    // Proses file di sini
    console.log(file);
  };

  return (
    <MantineProvider>
      <div style={{ padding: 32 }}>
        <h1>Ornamental Plants and Flowers Classifier 🪴 🌸</h1>
        <ImageUpload onImageUpload={handleImageUpload} />
      </div>
    </MantineProvider>
  );
}

export default App;