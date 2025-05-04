
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trash } from 'lucide-react';
import { ProductLink } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { callRPC } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';

interface ProductLinksTableProps {
  links: ProductLink[];
  onAddLink?: () => void;
  onDeleteLink?: (id: string) => void;
}

const ProductLinksTable = ({ links, onAddLink, onDeleteLink }: ProductLinksTableProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const { data, error } = await callRPC<boolean, { p_link_id: string }>(
        'delete_product_link',
        { p_link_id: id }
      );

      if (error) {
        console.error('Error deleting link:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the link"
        });
        return;
      }

      if (data && onDeleteLink) {
        onDeleteLink(id);
        toast({
          title: "Link Deleted",
          description: "Product link has been removed"
        });
      }
    } catch (err) {
      console.error('Error in handleDeleteLink:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Price Comparison</CardTitle>
        {user && onAddLink && (
          <Button onClick={onAddLink}>Add Link</Button>
        )}
      </CardHeader>
      <CardContent>
        {links.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map(link => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div className="font-medium">{link.source_name}</div>
                    <div className="text-sm text-muted-foreground">{link.product_name}</div>
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(link.price)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      
                      {user && onDeleteLink && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No price comparison links added yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductLinksTable;
