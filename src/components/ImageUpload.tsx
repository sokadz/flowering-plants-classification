import React, { useRef, useState } from 'react';
import { Button, Text, Paper, Group, rem, Stack } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      
      if (supportedTypes.includes(file.type)) {
        onImageUpload(file);
      } else {
        alert(`Format ${file.type || 'HEIC'} tidak didukung. Silakan gunakan JPEG, PNG, atau WebP.`);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      
      if (supportedTypes.includes(file.type)) {
        onImageUpload(file);
      } else {
        alert(`Format ${file.type || 'HEIC'} tidak didukung. Silakan gunakan JPEG, PNG, atau WebP.`);
      }
    }
  };

  return (
    <Stack align="center" gap="sm">
      {/* Dropzone */}
      <Paper 
        p="xs"
        radius="md" 
        style={{ 
          border: isDragOver ? '2px dashed #40c057' : '2px dashed #e9ecef',
          backgroundColor: isDragOver ? '#f8f9fa' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s',
          width: '100%',
          maxWidth: '300px',
        }}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Stack align="center" gap="xs">
          <IconPhoto 
            size={rem(20)}
            color="#858e96" 
            stroke={1.5}
          />
          <div style={{ textAlign: 'center' }}>
            <Text size="sm" fw={500}>
              Choose an image to classify
            </Text>
            <Text size="xs" c="dimmed">
              Drag & drop or click to browse
            </Text>
          </div>
        </Stack>
      </Paper>

      {/* Upload Button */}
      <Group gap="md">
        <Button 
          variant="filled"
          color="black"
          size="xs"  
          radius="md"
          onClick={handleClick}
          style={{
            background: 'linear-gradient(45deg, #000000ff, #000000ff)',
            border: 'none',
          }}
        >
          Upload Image
        </Button>
      </Group>

      {/* File Format Info */}
      <Text size="xs" c="dimmed" ta="center">
        Supported: JPEG, PNG, WebP, GIF • Max size: 10MB
      </Text>
      <Text size="xs" c="red" ta="center">
        ⚠️ HEIC files not supported
      </Text>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </Stack>
  );
};

export default ImageUpload;