import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

// Update return type untuk include confidence
export async function classifyImage(file: File): Promise<{
    label: number;
    confidence: number;
    topPredictions?: Array<{ label: number; confidence: number; name: string }>;
}> {
    await loadModel();

    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.src = URL.createObjectURL(file);
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
            try {
                if (!model) return reject('Model not loaded');

                const tensor = tf.browser.fromPixels(img)
                    .resizeNearestNeighbor([224, 224])
                    .toFloat()
                    .div(255.0)
                    .expandDims(0);

                const prediction = model.predict(tensor) as tf.Tensor;
                const data = await prediction.data();
                const arr = Array.from(data);

                // Get top prediction
                const maxConfidence = Math.max(...arr);
                const maxIndex = arr.indexOf(maxConfidence);

                // Get top 3 predictions 
                const indexed = arr.map((confidence, index) => ({ index, confidence }))
                    .sort((a, b) => b.confidence - a.confidence)
                    .slice(0, 3);

                // Clean up tensors
                tensor.dispose();
                prediction.dispose();

                resolve({
                    label: maxIndex,
                    confidence: maxConfidence,
                    topPredictions: indexed.map(item => ({
                        label: item.index,
                        confidence: item.confidence,
                        name: `Class ${item.index + 1}`
                    }))
                });
            } catch (err) {
                console.error('Classification error:', err);
                reject(err);
            }
        };
        img.onerror = reject;
    });
}

export async function loadModel() {
    if (!model) {
        try {
            await tf.ready();
            console.log('TensorFlow.js backend:', tf.getBackend());
            console.log('Loading MobileNetV2 flower model...');

            const modelPath = process.env.NODE_ENV === 'production'
                ? '/flowers-and-plants-classification/flower_model_tfjs/model.json'
                : '/flower_model_tfjs/model.json';

            model = await tf.loadLayersModel(modelPath);
            console.log('✅ Model loaded successfully');
        } catch (error) {
            console.error('❌ Error loading model:', error);
            throw error;
        }
    }
}