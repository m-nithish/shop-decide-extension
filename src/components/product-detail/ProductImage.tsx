
import React from 'react';
import { ImageIcon } from 'lucide-react';

interface ProductImageProps {
  imageUrl: string | null;
  title: string;
}

const ProductImage = ({ imageUrl, title }: ProductImageProps) => {
  const hasValidImage = imageUrl && imageUrl.trim() !== '';

  return (
    <div className="rounded-lg overflow-hidden border bg-white mb-6">
      {hasValidImage ? (
        <img 
          src={imageUrl!} 
          alt={title} 
          className="w-full h-auto object-cover"
          onError={(e) => {
            // On error, replace with placeholder
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/800x600/f1f1f1/555555?text=No+Image';
          }}
        />
      ) : (
        <div className="aspect-[4/3] w-full flex items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-100">
          <div className="text-center p-8">
            <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No image available for this product</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImage;
