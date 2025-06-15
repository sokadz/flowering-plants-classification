import * as tf from '@tensorflow/tfjs';

export const preprocessImage = async (image: HTMLImageElement): Promise<tf.Tensor> => {
    const tensor = tf.browser.fromPixels(image);
    const resized = tf.image.resizeBilinear(tensor, [224, 224]); // Resize to MobileNetV3 input size
    const normalized = resized.div(255.0); // Normalize to [0, 1]
    const batched = normalized.expandDims(0); // Add batch dimension
    return batched;
};

export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};