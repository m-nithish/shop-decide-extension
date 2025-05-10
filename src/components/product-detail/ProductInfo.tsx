
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit } from 'lucide-react';
import { Product, Collection } from '@/types';
import { useProducts } from '@/context/ProductsContext';
import ProductEditForm from './ProductEditForm';
import { updateProduct } from '@/services/collectionService';
import { useToast } from '@/components/ui/use-toast';

interface ProductInfoProps {
  product: Product;
  collection?: Collection;
}

const ProductInfo = ({ product, collection }: ProductInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { addProduct, deleteProduct } = useProducts();
  const { toast } = useToast();

  const handleSaveEdit = async (updatedProduct: Product) => {
    try {
      // Use the updateProduct service function
      const { data, error } = await updateProduct({
        p_product_id: updatedProduct.id,
        p_title: updatedProduct.title,
        p_description: updatedProduct.description,
        p_price: updatedProduct.price,
        p_image_url: updatedProduct.imageUrl,
        p_product_url: updatedProduct.productUrl,
        p_source_name: updatedProduct.sourceName,
        p_collection_id: updatedProduct.collectionId !== 'none' ? updatedProduct.collectionId : null
      });
      
      if (error) {
        throw error;
      }
      
      // Update local state by replacing the product
      deleteProduct(product.id);
      addProduct({
        title: updatedProduct.title,
        description: updatedProduct.description,
        price: updatedProduct.price,
        imageUrl: updatedProduct.imageUrl,
        productUrl: updatedProduct.productUrl,
        sourceName: updatedProduct.sourceName,
        collectionId: updatedProduct.collectionId,
      });
      
      toast({
        title: "Product updated",
        description: "Product details have been updated successfully."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the product."
      });
    }
  };
  
  if (isEditing) {
    return (
      <ProductEditForm
        product={product}
        onSave={handleSaveEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="pt-6 pb-2">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{product.title}</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
        {product.description && (
          <div className="mb-4">
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}
        
        <div className="space-y-2 text-sm">
          {product.price && (
            <div className="flex justify-between">
              <span className="text-gray-500">Price:</span>
              <span className="font-medium">{product.price}</span>
            </div>
          )}
          
          {product.sourceName && (
            <div className="flex justify-between">
              <span className="text-gray-500">Source:</span>
              <span className="font-medium">{product.sourceName}</span>
            </div>
          )}
          
          {collection && (
            <div className="flex justify-between">
              <span className="text-gray-500">Collection:</span>
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: collection.color }}
                ></span>
                <span className="font-medium">{collection.name}</span>
              </div>
            </div>
          )}
          
          {product.dateAdded && (
            <div className="flex justify-between">
              <span className="text-gray-500">Added on:</span>
              <span className="font-medium">
                {new Date(product.dateAdded).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      {product.productUrl && (
        <CardFooter className="pb-4">
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => window.open(product.productUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Original
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductInfo;
