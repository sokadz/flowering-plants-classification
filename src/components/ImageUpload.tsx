import React, { useState, useRef } from 'react';
import { Button, Text, Group, Stack, Image, ActionIcon, Box } from '@mantine/core';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onImageRemove?: () => void; 
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onImageRemove }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Call parent handler
      onImageUpload(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Call parent callback to clear all state
    if (onImageRemove) {
      onImageRemove();
    }
  };

  return (
    <Box>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {!preview ? (
        // Upload area 
        <Box
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? '#40c057' : '#ced4da'}`,
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: dragActive ? '#f8f9fa' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={handleButtonClick}
        >
          <Stack gap="md" align="center">
            <IconPhoto size={48} color="#868e96" />
            <div>
              <Text size="lg" fw={500} c="dark">
                Choose an image to classify
              </Text>
              <Text size="sm" c="dimmed">
                Drag & drop or click to browse
              </Text>
            </div>
            <Button 
              leftSection={<IconUpload size={16} />}
              size="sm"
              variant="light"
            >
              Upload Image
            </Button>
            <Text size="xs" c="dimmed">
              Supported: JPG, PNG, WebP, GIF • Max size: 10MB
            </Text>
          </Stack>
        </Box>
      ) : (
        // Preview area with controls
        <Box>
          <Stack gap="md">
            {/* Image preview */}
            <Box style={{ position: 'relative', display: 'inline-block' }}>
              <Image
                src={preview}
                alt="Preview"
                w="100%"
                h={300}
                fit="cover"
                radius="md"
                style={{ maxWidth: '500px', margin: '0 auto' }}
              />
              
              {/* Remove button overlay */}
              <ActionIcon
                color="red"
                size="lg"
                radius="xl"
                variant="filled"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                onClick={handleRemoveImage}
              >
                <IconX size={18} />
              </ActionIcon>
            </Box>

            {/* Action buttons */}
            <Group justify="center" gap="sm">
              <Button
                leftSection={<IconUpload size={16} />}
                variant="light"
                size="sm"
                onClick={handleButtonClick}
              >
                Upload Different Image
              </Button>
              
              <Button
                leftSection={<IconX size={16} />}
                variant="subtle"
                color="red"
                size="sm"
                onClick={handleRemoveImage}
              >
                Remove Image
              </Button>
            </Group>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;