
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { callRPC } from '@/utils/supabaseHelpers';
import { SaveExternalSourceParams } from '@/types/supabase';

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
}

const AddSourceDialog = ({ open, onOpenChange, productId }: AddSourceDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    sourceType: 'other'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSourceTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, sourceType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params: SaveExternalSourceParams = {
        p_product_id: productId,
        p_title: formData.title,
        p_url: formData.url,
        p_source_type: formData.sourceType as 'youtube' | 'pinterest' | 'other'
      };

      const { error } = await callRPC<string, SaveExternalSourceParams>('save_external_source', params);

      if (error) throw error;

      toast({
        title: 'Source added',
        description: 'External source has been added successfully.'
      });

      // Reset form and close dialog
      setFormData({
        title: '',
        url: '',
        sourceType: 'other'
      });
      onOpenChange(false);
      
      // Reload the page to show the new source
      window.location.reload();
    } catch (error) {
      console.error('Error adding source:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add external source. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add External Source</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Source title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sourceType">Source Type</Label>
            <Select value={formData.sourceType} onValueChange={handleSourceTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="pinterest">Pinterest</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
