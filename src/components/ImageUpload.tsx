import React, { useState, useRef } from 'react';
import { X, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  currentImage?: string;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, currentImage, error }) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragActive, setDragActive] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; dimensions?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constantes de validação
  const MAX_FILE_SIZE = 1024 * 1024; // 1MB
  const MAX_DIMENSIONS = { width: 1024, height: 1024 }; // Máximo 1024x1024px
  const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const isValid = img.width <= MAX_DIMENSIONS.width && img.height <= MAX_DIMENSIONS.height;
        resolve(isValid);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  };

  const handleFile = async (file: File) => {
    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`A imagem deve ter no máximo ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    // Validar tipo
    if (!VALID_TYPES.includes(file.type)) {
      toast.error('Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validar dimensões
    const isValidDimensions = await validateImageDimensions(file);
    if (!isValidDimensions) {
      toast.error(`A imagem deve ter no máximo ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels`);
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);

      // Obter informações do arquivo
      const img = new Image();
      img.onload = () => {
        setFileInfo({
          name: file.name,
          size: formatFileSize(file.size),
          dimensions: `${img.width}x${img.height}px`
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    onImageChange(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setFileInfo(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        Imagem de Perfil <span className="text-xs text-custom-muted font-normal">(máx. 1MB)</span>
      </label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
            ? 'border-primary bg-primary/10'
            : error
              ? 'border-red-500 bg-red-500/10'
              : 'border-custom bg-card-custom hover:border-primary/50'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          aria-label="Selecionar imagem de perfil"
        />

        {preview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-custom"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                title="Remover imagem"
                aria-label="Remover imagem de perfil"
              >
                <X size={16} />
              </button>
            </div>

            {fileInfo && (
              <div className="text-xs text-custom-muted space-y-1">
                <p><strong>Arquivo:</strong> {fileInfo.name}</p>
                <p><strong>Tamanho:</strong> {fileInfo.size}</p>
                {fileInfo.dimensions && (
                  <p><strong>Dimensões:</strong> {fileInfo.dimensions}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-16 h-16 bg-custom rounded-full flex items-center justify-center">
              <User size={24} className="text-custom-muted" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-custom-muted">
                Arraste uma imagem aqui ou{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:text-blue-400 underline"
                >
                  clique para selecionar
                </button>
              </p>
              <div className="text-xs text-custom-muted space-y-1">
                <p className="font-medium text-primary">📁 Limite: {formatFileSize(MAX_FILE_SIZE)} (1MB)</p>
                <p>Formatos aceitos: JPEG, PNG, GIF, WebP</p>
                <p>Dimensões máximas: {MAX_DIMENSIONS.width}x{MAX_DIMENSIONS.height}px</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 