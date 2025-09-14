# 🌸 Flowering Plants Classifier 🌺

This project is a web application for classifying flowering plants using image classification techniques, developed for my undergraduate thesis. It utilizes React, TypeScript, and TensorFlow.js with the MobileNetV2 model to identify various species of flowers based on uploaded images.

## Features

- Upload images of flowering plants.
- Classify images using a pre-trained MobileNetV2 model.
- Display classification results including the predicted label and description.
- User-friendly interface built with Mantine.
- Wikipedia integration for comprehensive plant information.

## Technologies Used

- React
- TypeScript
- TensorFlow.js
- MobileNetV2
- Mantine

## Dataset

The model is trained using datasets from :

- **Oxford 102 Flowers Dataset**
  - Source: [Visual Geometry Group, University of Oxford](https://www.robots.ox.ac.uk/~vgg/data/flowers/102/index.html)

## Dataset Citation 

Nilsback, M. E., & Zisserman, A. (2008). Automated flower classification over a large number of classes. 
In Proceedings of the Indian Conference on Computer Vision, Graphics and Image Processing (pp. 722-729). 
IEEE Computer Society.

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

1. Upload an image of a flower using the upload button.
2. The application will process the image and classify it using the MobileNetV2 model.
3. The classification results, including the predicted label and confidence level, will be displayed on the screen.


## License

This project is licensed under the MIT License. See the LICENSE file for details.