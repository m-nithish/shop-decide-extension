
// Define request parameter types and response types for all our Supabase RPC functions

// Product Notes types
export type SaveProductNotesParams = {
  p_product_id: string;
  p_user_id: string;
  p_content: string;
};

export type SaveProductNotesResponse = {
  data: null;
  error: Error | null;
};

export type GetProductNoteParams = {
  p_product_id: string;
};

export type ProductNote = {
  id: string;
  product_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type GetProductNotesResponse = {
  data: ProductNote[] | null;
  error: Error | null;
};

// Product Links types
export type GetProductLinksParams = {
  p_product_id: string;
};

export type SaveProductLinkParams = {
  p_product_id: string;
  p_source_name: string;
  p_product_name: string;
  p_url: string;
  p_price?: number;
  p_rating?: number;
  p_review_count?: number;
};

export type ProductLink = {
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
};

export type GetProductLinksResponse = {
  data: ProductLink[] | null;
  error: Error | null;
};

// External Sources types
export type GetExternalSourcesParams = {
  p_product_id: string;
};

export type SaveExternalSourceParams = {
  p_product_id: string;
  p_title: string;
  p_url: string;
  p_source_type: 'youtube' | 'pinterest' | 'other';
};

export type ProductExternalSource = {
  id: string;
  product_id: string;
  title: string;
  url: string;
  source_type: 'youtube' | 'pinterest' | 'other';
  created_at: string;
};

export type GetExternalSourcesResponse = {
  data: ProductExternalSource[] | null;
  error: Error | null;
};

// Define a single consistent ExternalSource type for both components to use
export type ExternalSource = {
  id: string;
  product_id?: string;  // Make this optional for flexibility
  title: string;
  url: string;
  source_type: 'youtube' | 'pinterest' | 'other';  // Ensure this is strictly typed
  created_at?: string;  // Make optional since it might not be available when creating
};

// Collection types
export type SupabaseCollection = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
};

export type CreateCollectionParams = {
  p_name: string;
  p_description: string | null;
  p_color: string;
};

export type AddProductToCollectionParams = {
  p_product_id: string;
  p_collection_id: string;
};

export type RemoveProductFromCollectionParams = {
  p_product_id: string;
  p_collection_id: string;
};

export type GetProductsByCollectionParams = {
  p_collection_id: string;
};

export type ProductCollectionItem = {
  product_id: string;
};

// Product types
export type SupabaseProduct = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: string | null;
  image_url: string | null;
  product_url: string | null;
  source_name: string | null;
  created_at: string;
};

export type CreateProductParams = {
  p_title: string;
  p_description?: string | null;
  p_price?: string | null;
  p_image_url?: string | null;
  p_product_url?: string | null;
  p_source_name?: string | null;
};

export type UpdateProductParams = {
  p_product_id: string;
  p_title: string;
  p_description: string | null;
  p_price: string | null;
  p_image_url: string | null;
  p_product_url: string | null;
  p_source_name: string | null;
};

export type DeleteProductParams = {
  p_product_id: string;
};
