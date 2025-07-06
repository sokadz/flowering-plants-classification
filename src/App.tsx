import React, { useState } from 'react';
import { MantineProvider, Container, Title, Text, Loader, Image } from '@mantine/core';
import ImageUpload from './components/ImageUpload';
import { classifyImage } from './model/classifier';
import { flowerLabels } from './model/labels';

function App() {
  const [result, setResult] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setResult(null);
    setDescription(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const res = await classifyImage(file);
      setResult(flowerLabels[res.label] || `Class ${res.label + 1}`);
      setDescription(`Predicted class index: ${res.label + 1}`);
    } catch (e) {
      console.error(e);
      setResult('Error');
      setDescription('Failed to classify image.');
    }
    setLoading(false);
  };

  return (
    <MantineProvider>
      <Container size="sm" py="xl">
        <Title style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Ornamental Plants & Flowers Classifier 🌱 🪴 🌸
        </Title>
        <ImageUpload onImageUpload={handleImageUpload} />
        {preview && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Image src={preview} alt="Preview" width={300} radius="md" />
          </div>
        )}
        {loading && <Loader mt="md" />}
        {result && (
          <div style={{ marginTop: 24 }}>
            <Title order={3}>Result: {result}</Title>
            <Text>Description: {description}</Text>
          </div>
        )}
      </Container>
    </MantineProvider>
  );
}

export default App;