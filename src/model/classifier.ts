import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | tf.GraphModel | null = null;

export async function loadModel() {
    if (!model) {
        // model = await tf.loadGraphModel('/mobilenetv3_flowers_tfjs/model.json');
        model = await tf.loadLayersModel('/mobilenetv3_flowers_tfjs/model.json');
    }
}

export async function classifyImage(file: File): Promise<{ label: number }> {
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
                const prediction = model.predict(tensor);
                // Handle case where prediction is an array of tensors, common for some models.
                const outputTensor = Array.isArray(prediction) ? prediction[0] : prediction;
                const data = await (outputTensor as tf.Tensor).data();
                const arr = Array.from(data);
                const max = arr.reduce((a, b) => Math.max(a, b), -Infinity);
                const classIdx = arr.indexOf(max);
                resolve({ label: classIdx });
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = reject;
    });
}