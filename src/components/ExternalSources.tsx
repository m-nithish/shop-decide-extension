
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash, Edit, ExternalLink, Plus, LinkIcon, Youtube, BookOpen, Newspaper, Coffee, Image } from 'lucide-react';
import { ExternalSource } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { callRPC } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';

interface ExternalSourcesProps {
  sources: ExternalSource[];
  onAddSource?: () => void;
  onDeleteSource?: (id: string) => void;
  onEditSource?: (source: ExternalSource) => void;
}

// Link Preview Component - Same as in ProductLinksTable.tsx
const LinkPreview = ({ url, title }: { url: string, title: string }) => {
  const [preview, setPreview] = useState<{
    title?: string;
    description?: string;
    image?: string;
    favicon?: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    const getFavicon = (domain: string) => {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    };

    const getOgImage = (domain: string, urlString: string) => {
      // Get placeholder image based on domain
      if (domain.includes('amazon')) {
        return 'https://m.media-amazon.com/images/G/01/social_share/amazon_logo._CB633266945_.png';
      } else if (domain.includes('youtube')) {
        // For YouTube links, try to extract video ID and get thumbnail
        try {
          const urlObj = new URL(urlString);
          const videoId = urlObj.searchParams.get('v');
          if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        } catch (e) {
          // Fall back to default image
        }
        return 'https://www.youtube.com/img/desktop/yt_1200.png';
      } else if (domain.includes('pinterest')) {
        return 'https://s.pinimg.com/webapp/logo_trans-180x180.png';
      } else if (domain.includes('etsy')) {
        return 'https://www.etsy.com/images/etsy_logo_1200x630.png';
      } else if (domain.includes('wayfair')) {
        return 'https://assets.wfcdn.com/asset/image/wayfair-share.jpg';
      } else if (domain.includes('homedepot')) {
        return 'https://assets.thdstatic.com/images/v1/brand-logos/the-home-depot.png';
      } else if (domain.includes('walmart')) {
        return 'https://i5.walmartimages.com/dfw/63fd9f59-b3e1/7a569e53-f29a-4c3d-bfaf-6f7a158bfadd/v1/walmartLogo.svg';
      } else if (domain.includes('target')) {
        return 'https://target.scene7.com/is/content/Target/GUEST_ceb549a5-ad82-4b29-b5c3-a1dd168add9c';
      } else {
        // Generic placeholder for other sites
        return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;
      }
    };

    try {
      setLoading(true);
      setError(false);
      const domain = new URL(url).hostname;
      const favicon = getFavicon(domain);
      const ogImage = getOgImage(domain, url);
      
      setPreview({
        title: title,
        description: `Link to ${domain}`,
        favicon: favicon,
        image: ogImage
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
        <Image className="h-6 w-6 mx-auto mb-2" />
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
        <div className="flex items-center gap-2">
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
          </div>
        </div>

        <div className="text-xs text-blue-500 mt-1 truncate max-w-[250px] overflow-hidden text-ellipsis">
          {url}
        </div>
        
        {/* Preview iframe with image */}
        <div className="mt-3 border rounded overflow-hidden">
          <div className="bg-gray-100 p-1 flex items-center justify-between border-b">
            <div className="text-xs truncate max-w-[180px]">{new URL(url).hostname}</div>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleOpenLink}>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
          <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
            {preview.image ? (
              <div className="w-full h-full relative">
                <img 
                  src={preview.image} 
                  alt={title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails, show fallback
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('fallback-image');
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-2">
                  <Button size="sm" variant="secondary" className="w-full mt-auto" onClick={handleOpenLink}>
                    Visit Link
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <Button size="sm" variant="outline" className="mt-2" onClick={handleOpenLink}>
                  Visit Link
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Get the icon based on source type
const getSourceTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Youtube className="h-4 w-4" />;
    case 'article':
      return <Newspaper className="h-4 w-4" />;
    case 'blog':
      return <BookOpen className="h-4 w-4" />;
    case 'inspiration':
      return <Coffee className="h-4 w-4" />;
    default:
      return <LinkIcon className="h-4 w-4" />;
  }
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

const ExternalSources = ({ sources, onAddSource, onDeleteSource, onEditSource }: ExternalSourcesProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Filter sources by type
  const filteredSources = activeTab === "all" 
    ? sources 
    : sources.filter(source => source.source_type === activeTab);
  
  // Get unique source types for tabs
  const sourceTypes = ["all", ...new Set(sources.map(source => source.source_type))];
  
  // Handle delete source
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

  // Format the source type for display
  const formatSourceType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>External Sources</CardTitle>
          {sourceTypes.length > 1 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList>
                {sourceTypes.map(type => (
                  <TabsTrigger key={type} value={type}>
                    {formatSourceType(type)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>
        
        {user && onAddSource && (
          <Button onClick={onAddSource} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Source
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {filteredSources.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredSources.map(source => (
              <div 
                key={source.id} 
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getSourceTypeIcon(source.source_type)}
                </div>
                
                <div className="flex-grow min-w-0">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div 
                        onClick={() => window.open(source.url, '_blank')} 
                        className="cursor-pointer"
                      >
                        <h3 className="text-sm font-medium hover:text-blue-600 hover:underline transition-colors">{source.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getFaviconUrl(source.url) && (
                            <img 
                              src={getFaviconUrl(source.url) || ''} 
                              alt="" 
                              className="w-3 h-3"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <span className="text-xs text-gray-500 truncate">{source.url}</span>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-0">
                      <div className="p-4 bg-white rounded-md shadow-lg border">
                        <LinkPreview url={source.url} title={source.title} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {formatSourceType(source.source_type)}
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 flex items-center gap-1">
                  <Button
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7" 
                    onClick={() => window.open(source.url, '_blank')}
                    title="Visit source"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                  
                  {user && onEditSource && (
                    <Button
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7" 
                      onClick={() => onEditSource(source)}
                      title="Edit source"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  
                  {user && onDeleteSource && (
                    <Button
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" 
                      onClick={() => handleDeleteSource(source.id)}
                      title="Delete source"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No external sources added yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExternalSources;
