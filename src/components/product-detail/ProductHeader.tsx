
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash } from 'lucide-react';
import { Collection, Product } from '@/types';

interface ProductHeaderProps {
  product: Product;
  collection?: Collection;
  onDelete: () => void;
}

const ProductHeader = ({ product, collection, onDelete }: ProductHeaderProps) => {
  const navigate = useNavigate();
  const formattedDate = new Date(product.dateAdded).toLocaleDateString();

  const handleBackClick = () => {
    if (product.collectionId && collection) {
      // If product belongs to a collection, navigate to that collection
      navigate(`/collection/${product.collectionId}`);
    } else {
      // Otherwise, navigate to products tab on home page
      navigate('/');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <Button 
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4 mr-2" /> Delete
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold">{product.title}</h1>
    </div>
  );
};

export default ProductHeader;
