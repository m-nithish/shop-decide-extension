
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { Link as LinkIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const formattedDate = new Date(product.dateAdded).toLocaleDateString();

  return (
    <Card className="product-card overflow-hidden h-full flex flex-col bg-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-all hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
          {product.price}
        </div>
      </div>
      
      <CardContent className="flex-grow p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{product.sourceName}</span>
          <span>{formattedDate}</span>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex gap-2">
        <Link to={`/product/${product.id}`} className="flex-grow">
          <Button variant="secondary" className="w-full">View Details</Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="flex-shrink-0"
          onClick={() => window.open(product.productUrl, '_blank')}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
