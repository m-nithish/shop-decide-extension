
import React, { useState } from 'react';
import ProductNotes from '@/components/ProductNotes';
import ProductLinksTable from '@/components/ProductLinksTable';
import ExternalSources from '@/components/ExternalSources';
import { ProductLink, ExternalSource } from '@/types/supabase';
import AddLinkDialog from '@/components/dialogs/AddLinkDialog';
import AddSourceDialog from '@/components/dialogs/AddSourceDialog';

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
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);

  const handleAddLink = () => {
    setIsLinkDialogOpen(true);
  };

  const handleAddSource = () => {
    setIsSourceDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <ProductNotes productId={productId} initialNotes={notes} />
      <ProductLinksTable links={productLinks} onAddLink={handleAddLink} />
      <ExternalSources sources={externalSources} onAddSource={handleAddSource} />
      
      <AddLinkDialog 
        open={isLinkDialogOpen} 
        onOpenChange={setIsLinkDialogOpen}
        productId={productId}
      />
      
      <AddSourceDialog
        open={isSourceDialogOpen}
        onOpenChange={setIsSourceDialogOpen}
        productId={productId}
      />
    </div>
  );
};

export default ProductDetailSidebar;
