
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collection } from '@/types';
import { Folder } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
  onDelete?: (id: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onDelete }) => {
  const formattedDate = new Date(collection.createdAt).toLocaleDateString();
  
  return (
    <Card className="product-card overflow-hidden h-full flex flex-col bg-white">
      <div 
        className="h-24 flex items-center justify-center"
        style={{ backgroundColor: `${collection.color}20` }}
      >
        <Folder size={40} style={{ color: collection.color }} />
      </div>
      
      <CardContent className="flex-grow p-4">
        <h3 className="font-semibold text-lg mb-1">{collection.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{collection.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Created: {formattedDate}</span>
          <span>{collection.productCount || 0} products</span>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <Link to={`/collection/${collection.id}`} className="w-full">
          <Button variant="secondary" className="w-full">View Collection</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CollectionCard;
