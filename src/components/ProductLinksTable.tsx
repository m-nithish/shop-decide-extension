import React, { useState, useRef, useEffect } from 'react';
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
import { 
  ExternalLink, Trash, Edit, Star, MessageSquare, ChevronUp, ChevronDown,
  Eye, Link as LinkIcon, MessageCircle, Info
} from 'lucide-react';
import { ProductLink } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { callRPC } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ProductLinksTableProps {
  links: ProductLink[];
  onAddLink?: () => void;
  onDeleteLink?: (id: string) => void;
  onEditLink?: (link: ProductLink) => void;
}

// Link Preview Component
const LinkPreview = ({ url, title }: { url: string, title: string }) => {
  const [preview, setPreview] = useState<{
    title?: string;
    description?: string;
    image?: string;
    favicon?: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getFavicon = (domain: string) => {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    };

    try {
      setLoading(true);
      setError(false);
      const domain = new URL(url).hostname;
      const favicon = getFavicon(domain);
      
      // Simple preview with favicon and OG metadata
      setPreview({
        title: title,
        description: `Link to ${domain}`,
        favicon: favicon
      });
      setLoading(false);
    } catch (err) {
      console.error("Error generating preview:", err);
      setError(true);
      setLoading(false);
    }
  }, [url, title]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-5 w-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-gray-500">
        <Info className="h-6 w-6 mx-auto mb-2" />
        <p>Could not load preview</p>
      </div>
    );
  }

  const handleOpenLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {preview.favicon && (
          <img 
            src={preview.favicon} 
            alt="" 
            className="w-8 h-8 rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div>
          <h3 className="font-medium text-sm">{preview.title || title}</h3>
          <p className="text-xs text-gray-500">{preview.description}</p>
          <div className="text-xs text-blue-500 mt-1 truncate max-w-[250px] overflow-hidden text-ellipsis">
            {url}
          </div>
          
          {/* Preview iframe */}
          <div className="mt-3 border rounded overflow-hidden">
            <div className="bg-gray-100 p-1 flex items-center justify-between border-b">
              <div className="text-xs truncate max-w-[180px]">{new URL(url).hostname}</div>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleOpenLink}>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            <div className="aspect-video bg-white flex items-center justify-center">
              <div className="text-center p-4">
                <LinkIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <Button size="sm" variant="outline" className="mt-2" onClick={handleOpenLink}>
                  Visit Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductLinksTable = ({ links, onAddLink, onDeleteLink, onEditLink }: ProductLinksTableProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayMode, setDisplayMode] = useState<'all' | 'prices' | 'ratings'>('all');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [orderedLinks, setOrderedLinks] = useState<ProductLink[]>(links);

  // Update ordered links when props change
  useEffect(() => {
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

  // Handle product link click to open the URL
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank');
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
                        className="h-6 w-6 rounded-full hover:bg-gray-100"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-gray-100"
                        onClick={() => moveDown(index)}
                        disabled={index === orderedLinks.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div 
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => handleLinkClick(link.url)}
                        >
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
                            <div className="font-medium hover:text-blue-600 hover:underline transition-colors">{link.source_name}</div>
                            <div className="text-sm text-muted-foreground">{link.product_name}</div>
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-0">
                        <div className="p-4 bg-white rounded-md shadow-lg border">
                          <LinkPreview url={link.url} title={link.product_name} />
                        </div>
                      </HoverCardContent>
                    </HoverCard>
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
                    <TableCell className="max-w-[200px]">
                      {link.comments ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="text-sm">{link.comments}</div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  )}
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                        title="Visit product page"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      
                      {user && onEditLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLink(link)}
                          title="Edit link"
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
                          title="Delete link"
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
