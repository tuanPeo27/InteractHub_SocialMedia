import { useState } from 'react';

interface UseImageUploadReturn {
  images: string[];
  previews: string[];
  uploading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
}

export const useImageUpload = (maxImages: number = 4): UseImageUploadReturn => {
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    const newPreviews: string[] = [];
    const fileReaders: Promise<string>[] = [];

    Array.from(files).slice(0, maxImages - images.length).forEach(file => {
      const reader = new FileReader();
      
      const promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });

      fileReaders.push(promise);
    });

    Promise.all(fileReaders).then(results => {
      setPreviews([...previews, ...results]);
      setImages([...images, ...results]);
      setUploading(false);
    });
  };

  const removeImage = (index: number) => {
    setPreviews(previews.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setPreviews([]);
    setImages([]);
  };

  return {
    images,
    previews,
    uploading,
    handleFileChange,
    removeImage,
    clearImages,
  };
};
