// components/admin/ImageUploader.jsx
'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUploader({ onUpload, multiple = false, maxFiles = 5, accept = "image/*" }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please upload image files only');
      return;
    }

    if (!multiple && imageFiles.length > 1) {
      toast.error('Only one file can be uploaded at a time');
      return;
    }

    if (images.length + imageFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    
    // Create preview URLs
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      progress: 0
    }));
    
    setImages(prev => [...prev, ...newImages]);

    // Simulate upload (replace with actual upload to your server/cloudinary)
    for (const image of newImages) {
      try {
        // Simulate progress
        for (let i = 0; i <= 100; i += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setImages(prev => prev.map(img => 
            img.preview === image.preview ? { ...img, progress: i } : img
          ));
        }
        
        // Here you would actually upload to your server
        // const formData = new FormData();
        // formData.append('image', image.file);
        // const response = await fetch('/api/upload', { method: 'POST', body: formData });
        // const data = await response.json();
        
        // Simulate successful upload
        const uploadedUrl = image.preview; // Replace with actual URL from server
        
        setImages(prev => prev.map(img => 
          img.preview === image.preview ? { 
            ...img, 
            uploading: false, 
            uploaded: true,
            url: uploadedUrl 
          } : img
        ));
        
        if (onUpload) {
          onUpload(uploadedUrl);
        }
        
      } catch (error) {
        setImages(prev => prev.map(img => 
          img.preview === image.preview ? { ...img, error: true, uploading: false } : img
        ));
        toast.error(`Failed to upload ${image.file.name}`);
      }
    }
    
    setUploading(false);
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer
          ${dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-600 hover:border-primary hover:bg-primary/5'
          }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg font-semibold mb-2">Upload Images</p>
          <p className="text-sm text-gray-400">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports: JPG, PNG, GIF, WebP (Max {maxFiles} files)
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold mb-3">Uploaded Images ({images.length}/{maxFiles})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.preview}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Upload Progress Overlay */}
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                        <div className="w-3/4 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-dark transition-all duration-300"
                            style={{ width: `${image.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-white mt-2">{image.progress}%</span>
                      </div>
                    )}
                    
                    {/* Success Overlay */}
                    {image.uploaded && !image.uploading && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                    
                    {/* Error Overlay */}
                    {image.error && (
                      <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 left-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  {image.uploaded && !image.uploading && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {image.file?.name || 'Image uploaded'}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}