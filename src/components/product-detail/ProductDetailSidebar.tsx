
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
  onProductLinksChange?: (links: ProductLink[]) => void;
  onExternalSourcesChange?: (sources: ExternalSource[]) => void;
}

const ProductDetailSidebar = ({ 
  productId, 
  notes, 
  productLinks, 
  externalSources,
  onProductLinksChange,
  onExternalSourcesChange
}: ProductDetailSidebarProps) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);

  const handleAddLink = () => {
    setIsLinkDialogOpen(true);
  };

  const handleAddSource = () => {
    setIsSourceDialogOpen(true);
  };

  const handleLinkAdded = (newLink: ProductLink) => {
    const updatedLinks = [...productLinks, newLink];
    if (onProductLinksChange) {
      onProductLinksChange(updatedLinks);
    }
  };

  const handleSourceAdded = (newSource: ExternalSource) => {
    const updatedSources = [...externalSources, newSource];
    if (onExternalSourcesChange) {
      onExternalSourcesChange(updatedSources);
    }
  };

  const handleLinkDeleted = (linkId: string) => {
    const updatedLinks = productLinks.filter(link => link.id !== linkId);
    if (onProductLinksChange) {
      onProductLinksChange(updatedLinks);
    }
  };

  const handleSourceDeleted = (sourceId: string) => {
    const updatedSources = externalSources.filter(source => source.id !== sourceId);
    if (onExternalSourcesChange) {
      onExternalSourcesChange(updatedSources);
    }
  };

  return (
    <div className="space-y-8">
      <ProductNotes productId={productId} initialNotes={notes} />
      <ProductLinksTable 
        links={productLinks} 
        onAddLink={handleAddLink}
        onDeleteLink={handleLinkDeleted}
      />
      <ExternalSources 
        sources={externalSources} 
        onAddSource={handleAddSource}
        onDeleteSource={handleSourceDeleted}
      />
      
      <AddLinkDialog 
        open={isLinkDialogOpen} 
        onOpenChange={setIsLinkDialogOpen}
        productId={productId}
        onLinkAdded={handleLinkAdded}
      />
      
      <AddSourceDialog
        open={isSourceDialogOpen}
        onOpenChange={setIsSourceDialogOpen}
        productId={productId}
        onSourceAdded={handleSourceAdded}
      />
    </div>
  );
};

export default ProductDetailSidebar;
