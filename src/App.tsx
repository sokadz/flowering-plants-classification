/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { 
  MantineProvider, 
  Container, 
  Title, 
  Text, 
  Loader, 
  Card, 
  Stack,
  Center,
  createTheme,
  rem
} from '@mantine/core';
import '@mantine/core/styles.css';
import ImageUpload from './components/ImageUpload';
import { classifyImage } from './model/classifier';
import { flowerLabels } from './model/labels';
import { PlantDetails } from './components/FlowerDetails';

const theme = createTheme({
  primaryColor: 'green',
  fontFamily: 'Inter, sans-serif',
});

function App() {
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasImage, setHasImage] = useState(false); 

  const handleImageUpload = async (file: File) => {
    // Reset all state
    setConfidence(null);
    setClassId(null);
    setLoading(true);
    setHasImage(true); 
    
    try {
      const res = await classifyImage(file);
      const flowerName = flowerLabels[res.label] || `Class ${res.label + 1}`;
      
      setResult(flowerName);
      setConfidence(res.confidence);
      setClassId(res.label);
      
    } catch (e) {
      console.error(e);
      setConfidence(null);
      setClassId(null);
    }
    setLoading(false);
  };


  // Handler when image is removed
  const handleImageRemove = () => {
    setConfidence(null);
    setClassId(null);
    setLoading(false);
    setHasImage(false);
  };

  return (
    <MantineProvider theme={theme}>
      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <div>
            <Title 
              order={1} 
              ta="center" 
              c="black"
              mb="xs"
              style={{ 
                fontSize: rem(32),
                fontWeight: 700,
              }}
            >
              🌸 Flowering Plants Classifier 🌺
            </Title>
            <Text ta="center" c="dimmed" size="lg">
              Upload an image to identify the flower species using MobileNetV2
            </Text>
          </div>

          {/* Image Upload */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <ImageUpload 
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove} 
            />
          </Card>
          
          {/* Loading */}
          {loading && (
            <Center>
              <Stack align="center" gap="md">
                <Loader color="green" size="lg" type="dots" />
                <Text c="dimmed">Analyzing your image...</Text>
              </Stack>
            </Center>
          )}

          {/* Plant Details */}
          {hasImage && classId !== null && confidence !== null && (
            <PlantDetails 
              classId={classId} 
              confidence={confidence} 
            />
          )}
        </Stack>
      </Container>
    </MantineProvider>
  );
}

export default App;