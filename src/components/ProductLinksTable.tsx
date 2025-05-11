
import React, { useState } from 'react';
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
import { ExternalLink, Trash, Edit, Star, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';
import { ProductLink } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { callRPC } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ProductLinksTableProps {
  links: ProductLink[];
  onAddLink?: () => void;
  onDeleteLink?: (id: string) => void;
  onEditLink?: (link: ProductLink) => void;
}

const ProductLinksTable = ({ links, onAddLink, onDeleteLink, onEditLink }: ProductLinksTableProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayMode, setDisplayMode] = useState<'all' | 'prices' | 'ratings'>('all');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [orderedLinks, setOrderedLinks] = useState<ProductLink[]>(links);

  // Update ordered links when props change
  React.useEffect(() => {
    setOrderedLinks(links);
  }, [links]);

  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  const handleEditLink = (link: ProductLink) => {
    if (onEditLink) {
      onEditLink(link);
    }
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

  // Drag and drop handlers
  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === id) return;
    
    const dragIndex = orderedLinks.findIndex(link => link.id === draggingId);
    const hoverIndex = orderedLinks.findIndex(link => link.id === id);
    
    if (dragIndex === -1 || hoverIndex === -1) return;
    
    // Create new array with reordered items
    const newLinks = [...orderedLinks];
    const dragItem = newLinks[dragIndex];
    newLinks.splice(dragIndex, 1);
    newLinks.splice(hoverIndex, 0, dragItem);
    
    setOrderedLinks(newLinks);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };
  
  // Move link up in order
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const newLinks = [...orderedLinks];
    [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
    setOrderedLinks(newLinks);
  };
  
  // Move link down in order
  const moveDown = (index: number) => {
    if (index >= orderedLinks.length - 1) return;
    const newLinks = [...orderedLinks];
    [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    setOrderedLinks(newLinks);
  };

  // Get favicon for a URL
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (e) {
      return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Comparison</CardTitle>
          <ToggleGroup
            type="single"
            value={displayMode}
            onValueChange={(value) => value && setDisplayMode(value as 'all' | 'prices' | 'ratings')}
            className="mt-2"
          >
            <ToggleGroupItem value="all" aria-label="Show all fields">All</ToggleGroupItem>
            <ToggleGroupItem value="prices" aria-label="Show prices">Prices</ToggleGroupItem>
            <ToggleGroupItem value="ratings" aria-label="Show ratings">Ratings</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {user && onAddLink && (
          <Button onClick={onAddLink}>Add Link</Button>
        )}
      </CardHeader>
      <CardContent>
        {orderedLinks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Source</TableHead>
                {(displayMode === 'all' || displayMode === 'prices') && (
                  <TableHead className="text-right">Price</TableHead>
                )}
                {(displayMode === 'all' || displayMode === 'ratings') && (
                  <TableHead className="text-right">Rating</TableHead>
                )}
                {(displayMode === 'all' || displayMode === 'ratings') && (
                  <TableHead className="text-right">Reviews</TableHead>
                )}
                {(displayMode === 'all') && (
                  <TableHead>Comments</TableHead>
                )}
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedLinks.map((link, index) => (
                <TableRow 
                  key={link.id}
                  draggable
                  onDragStart={() => handleDragStart(link.id)}
                  onDragOver={(e) => handleDragOver(e, link.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "cursor-move",
                    draggingId === link.id ? "opacity-50 bg-gray-100" : ""
                  )}
                >
                  <TableCell className="p-2">
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => moveDown(index)}
                        disabled={index === orderedLinks.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFaviconUrl(link.url) && (
                        <img 
                          src={getFaviconUrl(link.url) || ''} 
                          alt="" 
                          className="w-4 h-4"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium">{link.source_name}</div>
                        <div className="text-sm text-muted-foreground">{link.product_name}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  {(displayMode === 'all' || displayMode === 'prices') && (
                    <TableCell className="text-right">{formatPrice(link.price)}</TableCell>
                  )}
                  
                  {(displayMode === 'all' || displayMode === 'ratings') && (
                    <TableCell className="text-right">
                      {link.rating ? (
                        <div className="flex items-center justify-end gap-1">
                          <span>{link.rating.toFixed(1)}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                      ) : 'N/A'}
                    </TableCell>
                  )}
                  
                  {(displayMode === 'all' || displayMode === 'ratings') && (
                    <TableCell className="text-right">
                      {link.review_count ? (
                        <div className="flex items-center justify-end gap-1">
                          <span>{link.review_count}</span>
                          <MessageSquare className="h-3 w-3" />
                        </div>
                      ) : 'N/A'}
                    </TableCell>
                  )}
                  
                  {(displayMode === 'all') && (
                    <TableCell className="max-w-[200px] truncate">
                      {link.comments || '—'}
                    </TableCell>
                  )}
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      
                      {user && onEditLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLink(link)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
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
            No product comparison links added yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductLinksTable;
