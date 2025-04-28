import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash } from 'lucide-react';
import Header from '@/components/Header';
import { useProducts } from '@/context/ProductsContext';
import ProductNotes from '@/components/ProductNotes';
import ProductLinksTable from '@/components/ProductLinksTable';
import ExternalSources from '@/components/ExternalSources';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductNote {
  id: string;
  product_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ProductLink {
  id: string;
  product_id: string;
  source_name: string;
  product_name: string;
  url: string;
  price: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

interface ProductExternalSource {
  id: string;
  product_id: string;
  title: string;
  url: string;
  source_type: 'youtube' | 'pinterest' | 'other';
  created_at: string;
}

type GetProductNotesResponse = {
  data: ProductNote[] | null;
  error: Error | null;
}

type GetProductLinksResponse = {
  data: ProductLink[] | null;
  error: Error | null;
}

type GetExternalSourcesResponse = {
  data: ProductExternalSource[] | null;
  error: Error | null;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getCollection, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [productLinks, setProductLinks] = useState<ProductLink[]>([]);
  const [externalSources, setExternalSources] = useState<ProductExternalSource[]>([]);
  
  const product = products.find(p => p.id === id);
  
  useEffect(() => {
    if (id) {
      loadProductData();
    }
  }, [id]);

  const loadProductData = async () => {
    try {
      const { data: notesData, error: notesError } = await supabase.rpc('get_product_notes', { 
        p_product_id: id 
      }) as GetProductNotesResponse;

      if (notesError) {
        console.error('Error loading notes:', notesError);
      }

      if (notesData && notesData.length > 0) {
        setNotes(notesData[0].content || '');
      }

      const { data: linksData, error: linksError } = await supabase.rpc('get_product_links', {
        p_product_id: id
      }) as GetProductLinksResponse;

      if (linksError) {
        console.error('Error loading links:', linksError);
      }

      if (linksData) {
        setProductLinks(linksData || []);
      }

      const { data: sourcesData, error: sourcesError } = await supabase.rpc('get_external_sources', {
        p_product_id: id
      }) as GetExternalSourcesResponse;

      if (sourcesError) {
        console.error('Error loading sources:', sourcesError);
      }

      if (sourcesData) {
        const mappedSources = (sourcesData || []).map(source => ({
          ...source,
          source_type: (source.source_type as 'youtube' | 'pinterest' | 'other') || 'other'
        }));
        setExternalSources(mappedSources);
      }
    } catch (error) {
      console.error('Error in loadProductData:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product data"
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="container px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const collection = product.collectionId ? getCollection(product.collectionId) : undefined;
  const formattedDate = new Date(product.dateAdded).toLocaleDateString();
  
  const handleDelete = () => {
    deleteProduct(product.id);
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="rounded-lg overflow-hidden border bg-white mb-8">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Added on {formattedDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Collection</h3>
                    {collection ? (
                      <Link to={`/collection/${collection.id}`}>
                        <Badge 
                          className="mt-1 cursor-pointer"
                          style={{ 
                            backgroundColor: `${collection.color}20`, 
                            color: collection.color 
                          }}
                        >
                          {collection.name}
                        </Badge>
                      </Link>
                    ) : (
                      <p className="text-gray-700">Not in a collection</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <ProductNotes productId={id} initialNotes={notes} />
            <ProductLinksTable links={productLinks} onAddLink={() => {}} />
            <ExternalSources sources={externalSources} onAddSource={() => {}} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
