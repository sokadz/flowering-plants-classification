export interface ClassificationResult {
    label: string;
    description: string;
    confidence: number;
}

export interface ImageUploadProps {
    onImageUpload: (file: File) => void;
}

export interface ResultDisplayProps {
    result: ClassificationResult | null;
}

export interface LoaderProps {
    isLoading: boolean;
}