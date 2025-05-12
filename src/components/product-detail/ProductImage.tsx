
import React from 'react';
import { ImageIcon } from 'lucide-react';

interface ProductImageProps {
  imageUrl: string | null;
  title: string;
}

const ProductImage = ({ imageUrl, title }: ProductImageProps) => {
  const hasValidImage = imageUrl && imageUrl.trim() !== '';

  return (
    <div className="rounded-lg overflow-hidden border bg-white mb-6 shadow-sm">
      {hasValidImage ? (
        <img 
          src={imageUrl!} 
          alt={title} 
          className="w-full h-auto object-cover"
          onError={(e) => {
            // On error, replace with placeholder
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            
            // Create a visually appealing placeholder
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              canvas.width = 800;
              canvas.height = 600;
              
              // Create gradient background
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#f5f5f5');
              gradient.addColorStop(1, '#e0e0e0');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Draw icon
              ctx.fillStyle = '#cccccc';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = 'bold 100px sans-serif';
              ctx.fillText('📸', canvas.width/2, canvas.height/2 - 50);
              
              // Draw text
              ctx.fillStyle = '#999999';
              ctx.font = '24px sans-serif';
              ctx.fillText('Image Not Available', canvas.width/2, canvas.height/2 + 80);
              
              // Set placeholder
              target.src = canvas.toDataURL('image/png');
            }
          }}
        />
      ) : (
        <div className="aspect-[4/3] w-full flex items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-100">
          <div className="text-center p-8">
            <div className="bg-gray-100 rounded-full p-4 mb-4 w-16 h-16 flex items-center justify-center mx-auto">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No image available</p>
            <p className="text-gray-400 text-sm">Upload an image or add a URL to display product image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImage;
