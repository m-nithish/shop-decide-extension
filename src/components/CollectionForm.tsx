
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/context/ProductsContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const defaultColors = [
  '#F87171', // Red
  '#FB923C', // Orange
  '#FBBF24', // Amber
  '#A3E635', // Lime
  '#34D399', // Emerald
  '#22D3EE', // Cyan
  '#60A5FA', // Blue
  '#818CF8', // Indigo
  '#A78BFA', // Violet
  '#E879F9', // Pink
];

const CollectionForm = () => {
  const navigate = useNavigate();
  const { addCollection } = useProducts();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: defaultColors[Math.floor(Math.random() * defaultColors.length)],
  });
  
  const [selectedColorIndex, setSelectedColorIndex] = useState(
    defaultColors.indexOf(formData.color)
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleColorSelect = (color: string, index: number) => {
    setSelectedColorIndex(index);
    setFormData(prev => ({ ...prev, color }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newCollection = await addCollection(formData);
      
      if (newCollection) {
        toast({
          title: 'Collection created',
          description: `Collection "${formData.name}" has been created successfully.`,
        });
        
        // Navigate to the collection detail page using the new collection ID
        navigate(`/collection/${newCollection.id}`);
      } else {
        throw new Error('Failed to create collection');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create collection. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create Collection</CardTitle>
          <CardDescription>
            Create a new collection to organize your products.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="My Favorite Products"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your collection..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {defaultColors.map((color, index) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColorIndex === index ? 'border-gray-900' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color, index)}
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
          <Button 
            type="submit" 
            className="bg-theme-purple hover:bg-theme-purple/90"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Collection'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CollectionForm;
