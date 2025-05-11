
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Youtube, ExternalLink, Image, Trash, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import { ExternalSource } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { callRPC } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ExternalSourcesProps {
  sources: ExternalSource[];
  onAddSource?: () => void;
  onDeleteSource?: (id: string) => void;
  onEditSource?: (source: ExternalSource) => void;
}

const ExternalSources = ({ sources, onAddSource, onDeleteSource, onEditSource }: ExternalSourcesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [orderedSources, setOrderedSources] = useState<ExternalSource[]>(sources);

  // Update ordered sources when props change
  useEffect(() => {
    setOrderedSources(sources);
  }, [sources]);

  const handleDeleteSource = async (id: string) => {
    try {
      const { data, error } = await callRPC<boolean, { p_source_id: string }>(
        'delete_external_source',
        { p_source_id: id }
      );

      if (error) {
        console.error('Error deleting source:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the source"
        });
        return;
      }

      if (data && onDeleteSource) {
        onDeleteSource(id);
        toast({
          title: "Source Deleted",
          description: "External source has been removed"
        });
      }
    } catch (err) {
      console.error('Error in handleDeleteSource:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    }
  };

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === id) return;
    
    const dragIndex = orderedSources.findIndex(source => source.id === draggingId);
    const hoverIndex = orderedSources.findIndex(source => source.id === id);
    
    if (dragIndex === -1 || hoverIndex === -1) return;
    
    // Create new array with reordered items
    const newSources = [...orderedSources];
    const dragItem = newSources[dragIndex];
    newSources.splice(dragIndex, 1);
    newSources.splice(hoverIndex, 0, dragItem);
    
    setOrderedSources(newSources);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };
  
  // Move source up in order
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const newSources = [...orderedSources];
    [newSources[index], newSources[index - 1]] = [newSources[index - 1], newSources[index]];
    setOrderedSources(newSources);
  };
  
  // Move source down in order
  const moveDown = (index: number) => {
    if (index >= orderedSources.length - 1) return;
    const newSources = [...orderedSources];
    [newSources[index], newSources[index + 1]] = [newSources[index + 1], newSources[index]];
    setOrderedSources(newSources);
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
  
  const getSourceIcon = (type: string, url: string) => {
    // Try to get the favicon first
    const favicon = getFaviconUrl(url);
    
    if (favicon) {
      return (
        <img 
          src={favicon} 
          alt="" 
          className="h-4 w-4" 
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.onerror = null;
            // Show fallback icon on error
            if (type === 'youtube') {
              e.currentTarget.parentElement?.appendChild(
                document.createElementNS('http://www.w3.org/2000/svg', 'svg')
              );
            }
          }}
        />
      );
    }
    
    switch (type) {
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-600" />;
      case 'pinterest':
        return <Image className="h-4 w-4 text-red-500" />; 
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>External Sources</CardTitle>
        {user && onAddSource && (
          <Button onClick={onAddSource}>Add Source</Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {orderedSources.map((source, index) => (
            <div
              key={source.id}
              draggable
              onDragStart={() => handleDragStart(source.id)}
              onDragOver={(e) => handleDragOver(e, source.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-move",
                draggingId === source.id ? "opacity-50 bg-gray-100" : ""
              )}
            >
              <div className="flex flex-col items-center">
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
                  disabled={index === orderedSources.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              
              {getSourceIcon(source.source_type, source.url)}
              
              <div className="flex-grow">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-blue-600"
                >
                  {source.title}
                </a>
              </div>
              <Badge variant="secondary">{source.source_type}</Badge>
              
              {user && onEditSource && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditSource(source)}
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {user && onDeleteSource && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteSource(source.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {orderedSources.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No external sources added yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalSources;
