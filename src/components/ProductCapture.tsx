
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/context/ProductsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ensureUUID } from '@/utils/supabaseHelpers';

const ProductCapture: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collections, addProduct, fetchUserCollections } = useProducts();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get collectionId from URL query params if available
  const queryParams = new URLSearchParams(location.search);
  const preselectedCollectionId = queryParams.get('collectionId') || 'none';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    collectionId: preselectedCollectionId
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Load user collections when component mounts or when the user changes
  useEffect(() => {
    if (user) {
      fetchUserCollections().catch(err => {
        console.error('Failed to load collections:', err);
        toast({
          variant: 'destructive',
          title: 'Failed to load collections',
          description: 'There was an error loading your collections. Please try again later.'
        });
      });
    }
  }, [user, fetchUserCollections, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCollectionChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      collectionId: value === 'none' ? '' : ensureUUID(value)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add the product with just the essential fields
      const productData: Omit<Product, 'id' | 'dateAdded'> = {
        ...formData,
        price: '',
        imageUrl: '',
        productUrl: '',
        sourceName: ''
      };
      
      const newProduct = await addProduct(productData);
      
      if (newProduct) {
        toast({
          title: 'Product saved',
          description: 'Product has been saved successfully.'
        });
        
        // Navigate to product detail page
        navigate(`/product/${newProduct.id}`);
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save product information.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>
            Enter the basic product information - you can add more details after creation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Product Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Product title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Product description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collection">Collection</Label>
            <Select 
              value={formData.collectionId || 'none'} 
              onValueChange={handleCollectionChange}
            >
              <SelectTrigger id="collection">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Uncategorized</SelectItem>
                {collections.map(collection => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-theme-purple hover:bg-theme-purple/90" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Add Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductCapture;
