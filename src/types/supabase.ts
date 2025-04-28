
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
  title: string;
  url: string;
  source_type: 'youtube' | 'pinterest' | 'other';
};
