import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

export async function loadModel() {
    if (!model) {
        model = await mobilenet.load();
    }
}

export async function classifyImage(file: File) {
    await loadModel();

    return new Promise<{ label: string; description: string }>((resolve, reject) => {
        const img = new window.Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
            if (!model) return reject('Model not loaded');
            const predictions = await model.classify(img);
            resolve({
                label: predictions[0]?.className || 'Unknown',
                description: predictions[0]?.className || 'No description',
            });
        };
        img.onerror = reject;
    });
}