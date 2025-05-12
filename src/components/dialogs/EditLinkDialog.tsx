
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { callRPC } from '@/utils/supabaseHelpers';
import { ProductLink } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

interface EditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  link: ProductLink;
  onLinkUpdated: (link: ProductLink) => void;
}

const formSchema = z.object({
  sourceName: z.string().min(1, { message: 'Source name is required' }),
  productName: z.string().min(1, { message: 'Product name is required' }),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  price: z.string().optional(),
  rating: z.string().optional(),
  reviewCount: z.string().optional(),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditLinkDialog = ({ open, onOpenChange, productId, link, onLinkUpdated }: EditLinkDialogProps) => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceName: link.source_name || '',
      productName: link.product_name || '',
      url: link.url || '',
      price: link.price ? link.price.toString() : '',
      rating: link.rating ? link.rating.toString() : '',
      reviewCount: link.review_count ? link.review_count.toString() : '',
      comments: link.comments || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { data: updatedLink, error } = await callRPC<ProductLink, {
        p_link_id: string;
        p_source_name: string;
        p_product_name: string;
        p_url: string;
        p_price?: number;
        p_rating?: number;
        p_review_count?: number;
        p_comments?: string;
      }>(
        'update_product_link',
        {
          p_link_id: link.id,
          p_source_name: data.sourceName,
          p_product_name: data.productName,
          p_url: data.url,
          p_price: data.price ? parseFloat(data.price) : undefined,
          p_rating: data.rating ? parseFloat(data.rating) : undefined,
          p_review_count: data.reviewCount ? parseInt(data.reviewCount, 10) : undefined,
          p_comments: data.comments,
        }
      );

      if (error) {
        console.error('Error updating product link:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update the product link',
        });
        return;
      }

      toast({
        title: 'Link updated',
        description: 'The product link has been updated successfully',
      });

      // Update the link in the parent component
      if (updatedLink) {
        onLinkUpdated(updatedLink);
      } else {
        // If no updated link is returned, update with local data
        onLinkUpdated({
          ...link,
          source_name: data.sourceName,
          product_name: data.productName,
          url: data.url,
          price: data.price ? parseFloat(data.price) : null,
          rating: data.rating ? parseFloat(data.rating) : null,
          review_count: data.reviewCount ? parseInt(data.reviewCount, 10) : null,
          comments: data.comments || null,
        });
      }

      onOpenChange(false);
    } catch (err) {
      console.error('Error in onSubmit:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product Link</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sourceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Amazon, Walmart, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="49.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name as shown on the site" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" max="5" placeholder="4.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="42" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add your comments about this product link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Link</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLinkDialog;
