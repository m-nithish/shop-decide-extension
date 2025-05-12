
import React, { useState } from 'react';
import ProductLinksTable from '@/components/ProductLinksTable';
import ExternalSources from '@/components/ExternalSources';
import { ProductLink, ExternalSource } from '@/types/supabase';
import AddLinkDialog from '@/components/dialogs/AddLinkDialog';
import AddSourceDialog from '@/components/dialogs/AddSourceDialog';
import EditLinkDialog from '@/components/dialogs/EditLinkDialog';
import EditSourceDialog from '@/components/dialogs/EditSourceDialog';
import CollapsibleSection from './CollapsibleSection';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  productLinks, 
  externalSources,
  onProductLinksChange,
  onExternalSourcesChange
}: ProductDetailSidebarProps) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const [isEditLinkDialogOpen, setIsEditLinkDialogOpen] = useState(false);
  const [isEditSourceDialogOpen, setIsEditSourceDialogOpen] = useState(false);
  const [currentLinkToEdit, setCurrentLinkToEdit] = useState<ProductLink | null>(null);
  const [currentSourceToEdit, setCurrentSourceToEdit] = useState<ExternalSource | null>(null);

  const handleAddLink = () => {
    setIsLinkDialogOpen(true);
  };

  const handleAddSource = () => {
    setIsSourceDialogOpen(true);
  };

  const handleEditLink = (link: ProductLink) => {
    setCurrentLinkToEdit(link);
    setIsEditLinkDialogOpen(true);
  };

  const handleEditSource = (source: ExternalSource) => {
    setCurrentSourceToEdit(source);
    setIsEditSourceDialogOpen(true);
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

  const handleLinkUpdated = (updatedLink: ProductLink) => {
    const updatedLinks = productLinks.map(link => 
      link.id === updatedLink.id ? updatedLink : link
    );
    if (onProductLinksChange) {
      onProductLinksChange(updatedLinks);
    }
  };

  const handleSourceUpdated = (updatedSource: ExternalSource) => {
    const updatedSources = externalSources.map(source => 
      source.id === updatedSource.id ? updatedSource : source
    );
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
    <div className="space-y-4">
      <CollapsibleSection 
        title="Product Comparison" 
        defaultOpen={true} 
        action={
          <Button size="sm" variant="outline" onClick={handleAddLink} className="flex items-center">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        }
      >
        <ProductLinksTable 
          links={productLinks} 
          onAddLink={handleAddLink}
          onDeleteLink={handleLinkDeleted}
          onEditLink={handleEditLink}
        />
      </CollapsibleSection>
      
      <CollapsibleSection 
        title="External Sources" 
        defaultOpen={true}
        action={
          <Button size="sm" variant="outline" onClick={handleAddSource} className="flex items-center">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        }
      >
        <ExternalSources 
          sources={externalSources} 
          onAddSource={handleAddSource}
          onDeleteSource={handleSourceDeleted}
          onEditSource={handleEditSource}
        />
      </CollapsibleSection>
      
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

      {currentLinkToEdit && (
        <EditLinkDialog
          open={isEditLinkDialogOpen}
          onOpenChange={setIsEditLinkDialogOpen}
          productId={productId}
          link={currentLinkToEdit}
          onLinkUpdated={handleLinkUpdated}
        />
      )}

      {currentSourceToEdit && (
        <EditSourceDialog
          open={isEditSourceDialogOpen}
          onOpenChange={setIsEditSourceDialogOpen}
          productId={productId}
          source={currentSourceToEdit}
          onSourceUpdated={handleSourceUpdated}
        />
      )}
    </div>
  );
};

export default ProductDetailSidebar;
