import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/context/ProductsContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const colors = [
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#10B981', // Green
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6'  // Teal
];

const CollectionForm: React.FC = () => {
  const navigate = useNavigate();
  const { addCollection } = useProducts();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#8B5CF6'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newCollection = await addCollection(formData);
      setIsLoading(false);
      
      // Fixed: Redirect to the new collection's detail page instead of /collections
      if (newCollection && newCollection.id) {
        toast({
          title: "Collection Created",
          description: `${formData.name} collection has been created.`
        });
        navigate(`/collection/${newCollection.id}`);
      } else {
        // Fallback if for some reason we don't have the collection ID
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create collection. Please try again."
      });
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create Collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Smartphones, Dream Home, Gift Ideas"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What are you collecting?"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-theme-purple' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
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
            {isLoading ? 'Creating...' : 'Create Collection'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CollectionForm;
