
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Youtube, ExternalLink, Image } from 'lucide-react';
import { ExternalSource } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';

interface ExternalSourcesProps {
  sources: ExternalSource[];
  onAddSource?: () => void;
}

const ExternalSources = ({ sources, onAddSource }: ExternalSourcesProps) => {
  const { user } = useAuth();
  
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
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              {getSourceIcon(source.source_type)}
              <div className="flex-grow">
                <p className="font-medium">{source.title}</p>
              </div>
              <Badge variant="secondary">{source.source_type}</Badge>
            </a>
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
