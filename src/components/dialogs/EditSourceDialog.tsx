
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { callRPC } from '@/utils/supabaseHelpers';
import { ExternalSource } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

interface EditSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  source: ExternalSource;
  onSourceUpdated: (source: ExternalSource) => void;
}

const sourceTypes = ['youtube', 'pinterest', 'other', 'link', 'article', 'review'] as const;
type SourceType = typeof sourceTypes[number];

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  sourceType: z.enum(sourceTypes),
});

type FormValues = z.infer<typeof formSchema>;

const EditSourceDialog = ({ open, onOpenChange, productId, source, onSourceUpdated }: EditSourceDialogProps) => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: source.title || '',
      url: source.url || '',
      sourceType: (source.source_type as SourceType) || 'link',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { data: updatedSource, error } = await callRPC<ExternalSource, {
        p_source_id: string;
        p_title: string;
        p_url: string;
        p_source_type: SourceType;
      }>(
        'update_external_source',
        {
          p_source_id: source.id,
          p_title: data.title,
          p_url: data.url,
          p_source_type: data.sourceType,
        }
      );

      if (error) {
        console.error('Error updating external source:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update the external source',
        });
        return;
      }

      toast({
        title: 'Source updated',
        description: 'The external source has been updated successfully',
      });

      // Update the source in the parent component
      if (updatedSource) {
        onSourceUpdated(updatedSource);
      } else {
        // If no updated source is returned, update with local data
        onSourceUpdated({
          ...source,
          title: data.title,
          url: data.url,
          source_type: data.sourceType,
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

  // Detect source type from URL for autoselection
  const detectSourceType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      form.setValue('sourceType', 'youtube');
    } else if (url.includes('pinterest.com')) {
      form.setValue('sourceType', 'pinterest');
    } else {
      form.setValue('sourceType', 'link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit External Source</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Source title" {...field} />
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
                    <Input 
                      placeholder="https://example.com" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        detectSourceType(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sourceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="pinterest">Pinterest</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Source</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSourceDialog;
