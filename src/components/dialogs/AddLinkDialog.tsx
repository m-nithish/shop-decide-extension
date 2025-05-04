
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { callRPC } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';
import { ProductLink } from '@/types/supabase';

interface AddLinkDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLinkAdded?: (link: ProductLink) => void;
}

const AddLinkDialog = ({ productId, open, onOpenChange, onLinkAdded }: AddLinkDialogProps) => {
  const [formData, setFormData] = useState({
    sourceName: '',
    productName: '',
    url: '',
    price: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await callRPC<string, any>('save_product_link', {
        p_product_id: productId,
        p_source_name: formData.sourceName,
        p_product_name: formData.productName,
        p_url: formData.url,
        p_price: parseFloat(formData.price) || 0,
      });
      
      if (error) {
        console.error('Error adding link:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to add the link. Please try again.',
        });
      } else if (data) {
        toast({
          title: 'Link Added',
          description: 'Price comparison link has been added.',
        });
        
        // Create a complete link object to provide back to the parent
        const newLink: ProductLink = {
          id: data,
          product_id: productId,
          source_name: formData.sourceName,
          product_name: formData.productName,
          url: formData.url,
          price: parseFloat(formData.price) || 0,
          rating: 0,
          review_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Clear the form
        setFormData({
          sourceName: '',
          productName: '',
          url: '',
          price: '',
        });
        
        // Call onLinkAdded callback if provided
        if (onLinkAdded) {
          onLinkAdded(newLink);
        }
        
        // Close the dialog
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Price Comparison Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sourceName">Source Name</Label>
              <Input
                id="sourceName"
                name="sourceName"
                placeholder="e.g., Amazon, eBay, Walmart"
                value={formData.sourceName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                name="productName"
                placeholder="Product name on the source website"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                placeholder="https://..."
                value={formData.url}
                onChange={handleChange}
                required
                type="url"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLinkDialog;
