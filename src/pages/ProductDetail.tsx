
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useProducts } from '@/context/ProductsContext';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  GetProductNoteParams, 
  ProductNote,
  GetProductLinksParams,
  ProductLink,
  GetExternalSourcesParams,
  ExternalSource,
  ProductExternalSource
} from '@/types/supabase';
import { Button } from '@/components/ui/button';
import ProductHeader from '@/components/product-detail/ProductHeader';
import ProductImage from '@/components/product-detail/ProductImage';
import ProductInfo from '@/components/product-detail/ProductInfo';
import ProductDetailSidebar from '@/components/product-detail/ProductDetailSidebar';
import { callRPC } from '@/utils/supabaseHelpers';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, getCollection, deleteProduct } = useProducts();
  const { toast } = useToast();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [productLinks, setProductLinks] = useState<ProductLink[]>([]);
  const [externalSources, setExternalSources] = useState<ExternalSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Load product data
    if (id) {
      loadProductData();
    }
  }, [id, user, navigate]);

  const loadProductData = async () => {
    if (!id || !user) return;
    
    setIsLoading(true);
    try {
      // Get product data
      const productData = await getProduct(id);
      
      if (!productData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product"
        });
        navigate('/');
        return;
      }
      
      setProduct(productData);
      
      const notesParams: GetProductNoteParams = { p_product_id: id };
      const { data: notesData, error: notesError } = await callRPC<ProductNote[], GetProductNoteParams>(
        'get_product_notes', 
        notesParams
      );

      if (notesError) {
        console.error('Error loading notes:', notesError);
      }

      if (notesData && notesData.length > 0) {
        setNotes(notesData[0].content || '');
      }

      const linksParams: GetProductLinksParams = { p_product_id: id };
      const { data: linksData, error: linksError } = await callRPC<ProductLink[], GetProductLinksParams>(
        'get_product_links',
        linksParams
      );

      if (linksError) {
        console.error('Error loading links:', linksError);
      }

      if (linksData) {
        setProductLinks(linksData || []);
      }

      const sourcesParams: GetExternalSourcesParams = { p_product_id: id };
      const { data: sourcesData, error: sourcesError } = await callRPC<ProductExternalSource[], GetExternalSourcesParams>(
        'get_external_sources',
        sourcesParams
      );

      if (sourcesError) {
        console.error('Error loading sources:', sourcesError);
      }

      if (sourcesData) {
        const transformedSources: ExternalSource[] = (sourcesData || []).map(source => ({
          id: source.id,
          title: source.title,
          url: source.url,
          source_type: source.source_type
        }));
        setExternalSources(transformedSources);
      }
    } catch (error) {
      console.error('Error in loadProductData:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product data"
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle product link updates
  const handleProductLinksChange = (updatedLinks: ProductLink[]) => {
    setProductLinks(updatedLinks);
  };

  // Handle external sources updates
  const handleExternalSourcesChange = (updatedSources: ExternalSource[]) => {
    setExternalSources(updatedSources);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="container px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-purple"></div>
        </div>
      </div>
    );
  }

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
  
  const handleDelete = async () => {
    await deleteProduct(product.id);
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8">
        <ProductHeader 
          product={product} 
          collection={collection}
          onDelete={handleDelete}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ProductImage imageUrl={product.imageUrl} title={product.title} />
            <ProductInfo product={product} collection={collection} />
          </div>
          
          <ProductDetailSidebar 
            productId={id!}
            notes={notes}
            productLinks={productLinks}
            externalSources={externalSources}
            onProductLinksChange={handleProductLinksChange}
            onExternalSourcesChange={handleExternalSourcesChange}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
