import { useState } from 'react';
import { 
  MantineProvider, 
  Container, 
  Title, 
  Text, 
  Loader, 
  Image, 
  Progress, 
  Card, 
  Group, 
  Badge, 
  Stack,
  Center,
  createTheme,
  rem
} from '@mantine/core';
import '@mantine/core/styles.css';
import ImageUpload from './components/ImageUpload';
import { classifyImage } from './model/classifier';
import { flowerLabels } from './model/labels';

const theme = createTheme({
  primaryColor: 'green',
  fontFamily: 'Inter, sans-serif',
});

function App() {
  const [result, setResult] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [topPredictions, setTopPredictions] = useState<Array<{ 
    label: number; 
    confidence: number; 
    name: string 
  }> | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setResult(null);
    setDescription(null);
    setConfidence(null);
    setTopPredictions(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    
    try {
      const res = await classifyImage(file);
      const flowerName = flowerLabels[res.label] || `Class ${res.label + 1}`;
      
      setResult(flowerName);
      setConfidence(res.confidence);
      setDescription(`Predicted flower class: ${res.label + 1}/102`);
      
      if (res.topPredictions) {
        const topWithNames = res.topPredictions.map(pred => ({
          ...pred,
          name: flowerLabels[pred.label] || `Class ${pred.label + 1}`
        }));
        setTopPredictions(topWithNames);
      }
      
    } catch (e) {
      console.error(e);
      setResult('Error');
      setDescription('Failed to classify image.');
      setConfidence(null);
    }
    setLoading(false);
  };

  const getConfidenceColor = (conf: number): string => {
    if (conf >= 0.8) return 'green';
    if (conf >= 0.6) return 'yellow';
    if (conf >= 0.4) return 'orange';
    return 'red';
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
              🌱 Ornamental Plants & Flowers Classifier 🌸
            </Title>
            <Text ta="center" c="dimmed" size="lg">
              Upload an image to identify the flower species using MobileNetV2
            </Text>
          </div>

          {/* Image Upload */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <ImageUpload onImageUpload={handleImageUpload} />
          </Card>
          
          {/* Preview Image */}
          {preview && (
            <Center>
              <Image 
                src={preview} 
                alt="Preview" 
                w={400}
                h={300}
                fit="cover"
                radius="lg"
              />
            </Center>
          )}
          
          {/* Loading */}
          {loading && (
            <Center>
              <Stack align="center" gap="md">
                <Loader color="green" size="lg" type="dots" />
                <Text c="dimmed">Analyzing your image...</Text>
              </Stack>
            </Center>
          )}
          
          {/* Results */}
          {result && confidence !== null && (
            <Card shadow="lg" padding="xl" radius="lg" withBorder>
              <Stack gap="lg">
                {/* Header */}
                <Group justify="space-between" align="center">
                  <Title order={2} c="dark">
                    🎯 Classification Result
                  </Title>
                  <Badge 
                    color={getConfidenceColor(confidence)} 
                    size="xl"
                    radius="xl"
                    variant="filled"
                  >
                    {(confidence * 100).toFixed(1)}%
                  </Badge>
                </Group>
                
                {/* Main Result */}
                <Card bg="gray.0" radius="md" p="md">
                  <Group justify="space-between" align="center">
                    <div>
                      <Text size="xl" fw={700} c="dark">
                        {result}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {description}
                      </Text>
                    </div>
                  </Group>
                </Card>
                
                {/* Confidence Bar */}
                <div>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500}>Confidence Level</Text>
                    <Text size="sm" c="dimmed">
                      {confidence >= 0.8 ? 'Very Confident' : 
                       confidence >= 0.6 ? 'Confident' :
                       confidence >= 0.4 ? 'Moderate' : 'Low Confidence'}
                    </Text>
                  </Group>
                  <Progress 
                    value={confidence * 100} 
                    color={getConfidenceColor(confidence)}
                    size="xl" 
                    radius="xl"
                    animated
                  />
                </div>
                
                {/* Top Predictions */}
                {topPredictions && topPredictions.length > 1 && (
                  <div>
                    <Title order={4} mb="md">
                      🏆 Top Predictions
                    </Title>
                    <Stack gap="sm">
                      {topPredictions.map((pred, index) => (
                        <Card 
                          key={index} 
                          bg={index === 0 ? 'green.0' : 'gray.0'} 
                          radius="md" 
                          p="sm"
                        >
                          <Group justify="space-between" align="center">
                            <Group gap="sm">
                              <Badge 
                                color={index === 0 ? 'green' : 'gray'}
                                radius="xl"
                                size="lg"
                              >
                                #{index + 1}
                              </Badge>
                              <Text 
                                fw={index === 0 ? 600 : 400}
                                c={index === 0 ? 'green' : 'dark'}
                              >
                                {pred.name}
                              </Text>
                            </Group>
                            <Badge 
                              color={getConfidenceColor(pred.confidence)}
                              variant={index === 0 ? 'filled' : 'outline'}
                              radius="xl"
                            >
                              {(pred.confidence * 100).toFixed(1)}%
                            </Badge>
                          </Group>
                        </Card>
                      ))}
                    </Stack>
                  </div>
                )}
              </Stack>
            </Card>
          )}
        </Stack>
      </Container>
    </MantineProvider>
  );
}

export default App;