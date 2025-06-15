# Ornamental Plant Classifier

This project is a web application for classifying ornamental plants and flowers using image classification techniques. It utilizes React, TypeScript, and TensorFlow.js with the MobileNetV3 model to identify various species of plants based on uploaded images.

## Features

- Upload images of ornamental plants and flowers.
- Classify images using a pre-trained MobileNetV3 model.
- Display classification results including the predicted label and description.
- User-friendly interface built with Mantine.

## Technologies Used

- React
- TypeScript
- TensorFlow.js
- MobileNetV3
- Mantine

## Dataset

The model is trained using datasets from various sources, including:

- Oxford Flowers Dataset
- Kaggle Plant Classification Datasets
- iNaturalist
- PlantCLEF

These datasets contain a wide variety of images of flowers and plants, which help improve the accuracy of the classification model.

## Getting Started

To get a local copy up and running, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/ornamental-plant-classifier.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd ornamental-plant-classifier
   ```

3. **Install dependencies:**

   Make sure you have Node.js installed. Then run:

   ```bash
   npm install
   ```

4. **Run the application:**

   Start the development server:

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

## Usage

1. Upload an image of an ornamental plant or flower using the upload button.
2. The application will process the image and classify it using the MobileNetV3 model.
3. The classification results, including the predicted label and description, will be displayed on the screen.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.