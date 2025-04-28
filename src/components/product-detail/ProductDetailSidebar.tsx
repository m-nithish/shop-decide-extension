
import React from 'react';
import ProductNotes from '@/components/ProductNotes';
import ProductLinksTable from '@/components/ProductLinksTable';
import ExternalSources from '@/components/ExternalSources';
import { ProductLink, ExternalSource } from '@/types/supabase';

interface ProductDetailSidebarProps {
  productId: string;
  notes: string;
  productLinks: ProductLink[];
  externalSources: ExternalSource[];
}

const ProductDetailSidebar = ({ 
  productId, 
  notes, 
  productLinks, 
  externalSources 
}: ProductDetailSidebarProps) => {
  return (
    <div className="space-y-8">
      <ProductNotes productId={productId} initialNotes={notes} />
      <ProductLinksTable links={productLinks} onAddLink={() => {}} />
      <ExternalSources sources={externalSources} onAddSource={() => {}} />
    </div>
  );
};

export default ProductDetailSidebar;
