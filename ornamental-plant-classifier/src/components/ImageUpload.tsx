import React, { useState } from 'react';
import { FileInput, Button } from '@mantine/core';

type Props = {
  onImageUpload: (file: File) => void;
};

const ImageUpload: React.FC<Props> = ({ onImageUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <FileInput
        label="Upload an image"
        accept="image/*"
        value={file}
        onChange={setFile}
      />
      <Button onClick={() => file && onImageUpload(file)} disabled={!file}>
        Classify
      </Button>
    </>
  );
};

export default ImageUpload;