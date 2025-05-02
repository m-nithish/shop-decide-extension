
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { callRPC } from '@/utils/supabaseHelpers';
import { SaveProductLinkParams } from '@/types/supabase';

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
}

const AddLinkDialog = ({ open, onOpenChange, productId }: AddLinkDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sourceName: '',
    productName: '',
    url: '',
    price: '',
    rating: '',
    reviewCount: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params: SaveProductLinkParams = {
        p_product_id: productId,
        p_source_name: formData.sourceName,
        p_product_name: formData.productName,
        p_url: formData.url,
        p_price: parseFloat(formData.price) || 0,
        p_rating: parseFloat(formData.rating) || 0,
        p_review_count: parseInt(formData.reviewCount) || 0
      };

      const { error } = await callRPC<string, SaveProductLinkParams>('save_product_link', params);

      if (error) throw error;

      toast({
        title: 'Link added',
        description: 'Product link has been added successfully.'
      });

      // Reset form and close dialog
      setFormData({
        sourceName: '',
        productName: '',
        url: '',
        price: '',
        rating: '',
        reviewCount: ''
      });
      onOpenChange(false);
      
      // Reload the page to show the new link
      window.location.reload();
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add product link. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sourceName">Source Name</Label>
            <Input
              id="sourceName"
              name="sourceName"
              placeholder="Amazon, eBay, etc."
              value={formData.sourceName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              name="productName"
              placeholder="Product name as listed on the site"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              placeholder="https://example.com/product"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="99.99"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="4.5"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewCount">Reviews</Label>
              <Input
                id="reviewCount"
                name="reviewCount"
                type="number"
                placeholder="42"
                value={formData.reviewCount}
                onChange={handleChange}
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
