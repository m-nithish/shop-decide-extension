
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collection, Product } from '@/types';

interface ProductInfoProps {
  product: Product;
  collection?: Collection;
}

const ProductInfo = ({ product, collection }: ProductInfoProps) => {
  const formattedDate = new Date(product.dateAdded).toLocaleDateString();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>
          Added on {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Collection</h3>
            {collection ? (
              <Link to={`/collection/${collection.id}`}>
                <Badge 
                  className="mt-1 cursor-pointer"
                  style={{ 
                    backgroundColor: `${collection.color}20`, 
                    color: collection.color 
                  }}
                >
                  {collection.name}
                </Badge>
              </Link>
            ) : (
              <p className="text-gray-700">Not in a collection</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInfo;
