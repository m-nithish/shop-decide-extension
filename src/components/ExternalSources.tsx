
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Youtube, ExternalLink, Image, Trash } from 'lucide-react';
import { ExternalSource } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { callRPC } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';

interface ExternalSourcesProps {
  sources: ExternalSource[];
  onAddSource?: () => void;
  onDeleteSource?: (id: string) => void;
}

const ExternalSources = ({ sources, onAddSource, onDeleteSource }: ExternalSourcesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

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
  
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'pinterest':
        return <Image className="h-4 w-4" />; // Using Image icon instead of Pinterest
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
          {sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              {getSourceIcon(source.source_type)}
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
          {sources.length === 0 && (
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
