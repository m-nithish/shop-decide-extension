
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalSource } from '@/types/supabase';

interface AddSourceDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSourceAdded?: (source: ExternalSource) => void;
}

const AddSourceDialog = ({ productId, open, onOpenChange, onSourceAdded }: AddSourceDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    sourceType: 'website',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSourceTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sourceType: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await callRPC<string, any>('save_external_source', {
        p_product_id: productId,
        p_title: formData.title,
        p_url: formData.url,
        p_source_type: formData.sourceType,
      });
      
      if (error) {
        console.error('Error adding source:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to add the external source. Please try again.',
        });
      } else if (data) {
        toast({
          title: 'Source Added',
          description: 'External source has been added.',
        });
        
        // Create a complete source object to provide back to the parent
        const newSource: ExternalSource = {
          id: data,
          product_id: productId,
          title: formData.title,
          url: formData.url,
          source_type: formData.sourceType,
          created_at: new Date().toISOString(),
        };
        
        // Clear the form
        setFormData({
          title: '',
          url: '',
          sourceType: 'website',
        });
        
        // Call onSourceAdded callback if provided
        if (onSourceAdded) {
          onSourceAdded(newSource);
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
            <DialogTitle>Add External Source</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Review, Tutorial, etc."
                value={formData.title}
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
              <Label htmlFor="sourceType">Source Type</Label>
              <Select value={formData.sourceType} onValueChange={handleSourceTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="pinterest">Pinterest</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Source'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSourceDialog;
