
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
    price: '',
    imageUrl: '',
    productUrl: '',
    sourceName: '',
    collectionId: preselectedCollectionId
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Load user collections if authenticated
  useEffect(() => {
    if (user) {
      fetchUserCollections();
    }
  }, [user, fetchUserCollections]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCollectionChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      collectionId: value === 'none' ? '' : value 
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add the product and get the new product object
      const newProduct = await addProduct(formData as Omit<Product, 'id' | 'dateAdded'>);
      
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
          <CardTitle>Capture Product</CardTitle>
          <CardDescription>
            Add product details manually or paste a URL to auto-fill (simulated).
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                placeholder="$99.99"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceName">Source</Label>
              <Input
                id="sourceName"
                name="sourceName"
                placeholder="Amazon, eBay, etc."
                value={formData.sourceName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productUrl">Product URL</Label>
            <Input
              id="productUrl"
              name="productUrl"
              placeholder="https://example.com/product"
              value={formData.productUrl}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Enter an image URL or use a placeholder like "https://placehold.co/400x300"
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collection">Collection</Label>
            <Select 
              value={formData.collectionId} 
              onValueChange={handleCollectionChange}
            >
              <SelectTrigger id="collection">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                {/* Use "none" instead of empty string for uncategorized option */}
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
