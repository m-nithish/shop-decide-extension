
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit } from 'lucide-react';
import { Product, Collection } from '@/types';
import { useProducts } from '@/context/ProductsContext';
import ProductEditForm from './ProductEditForm';
import { updateProduct } from '@/services/collectionService';
import { useToast } from '@/components/ui/use-toast';
import ProductNotes from '@/components/ProductNotes';

interface ProductInfoProps {
  product: Product;
  collection?: Collection;
  notes: string;
  productId: string;
}

const ProductInfo = ({ product, collection, notes, productId }: ProductInfoProps) => {
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
    <Card className="mb-6 border border-gray-200 shadow-sm">
      <CardHeader className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Product Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">{product.title}</h2>
            {product.description && (
              <p className="text-gray-700 mb-4">{product.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.price && (
              <div className="space-y-1">
                <span className="text-gray-500 block">Price:</span>
                <span className="font-medium">{product.price}</span>
              </div>
            )}
            
            {product.sourceName && (
              <div className="space-y-1">
                <span className="text-gray-500 block">Source:</span>
                <span className="font-medium">{product.sourceName}</span>
              </div>
            )}
            
            {collection && (
              <div className="space-y-1">
                <span className="text-gray-500 block">Collection:</span>
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
              <div className="space-y-1">
                <span className="text-gray-500 block">Added on:</span>
                <span className="font-medium">
                  {new Date(product.dateAdded).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t mt-4">
            <h3 className="font-medium text-lg mb-3">My Notes</h3>
            <ProductNotes productId={productId} initialNotes={notes} />
          </div>
        </div>
      </CardContent>
      
      {product.productUrl && (
        <CardFooter className="p-4 border-t">
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
