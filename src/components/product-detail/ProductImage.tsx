
import React from 'react';

interface ProductImageProps {
  imageUrl: string;
  title: string;
}

const ProductImage = ({ imageUrl, title }: ProductImageProps) => {
  return (
    <div className="rounded-lg overflow-hidden border bg-white mb-8">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default ProductImage;
