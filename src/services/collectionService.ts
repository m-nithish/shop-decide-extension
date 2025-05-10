
import { supabase } from "@/integrations/supabase/client";
import { callRPC, ensureUUID } from "@/utils/supabaseHelpers";
import { 
  SupabaseCollection, 
  CreateCollectionParams,
  AddProductToCollectionParams,
  RemoveProductFromCollectionParams,
  GetProductsByCollectionParams,
  ProductCollectionItem,
  SupabaseProduct,
  CreateProductParams,
  UpdateProductParams,
  DeleteProductParams
} from "@/types/supabase";

export async function getUserCollections(): Promise<{ data: SupabaseCollection[] | null; error: Error | null }> {
  return await callRPC<SupabaseCollection[], {}>('get_user_collections');
}

export async function createCollection(params: CreateCollectionParams): Promise<{ data: string | null; error: Error | null }> {
  return await callRPC<string, CreateCollectionParams>('create_collection', params);
}

export async function deleteCollection(collectionId: string): Promise<{ data: boolean | null; error: Error | null }> {
  return await callRPC<boolean, { p_collection_id: string }>('delete_collection', { 
    p_collection_id: ensureUUID(collectionId)
  });
}

export async function addProductToCollection(params: AddProductToCollectionParams): Promise<{ data: string | null; error: Error | null }> {
  return await callRPC<string, AddProductToCollectionParams>('add_product_to_collection', {
    p_product_id: ensureUUID(params.p_product_id),
    p_collection_id: ensureUUID(params.p_collection_id)
  });
}

export async function removeProductFromCollection(params: RemoveProductFromCollectionParams): Promise<{ data: boolean | null; error: Error | null }> {
  return await callRPC<boolean, RemoveProductFromCollectionParams>('remove_product_from_collection', {
    p_product_id: ensureUUID(params.p_product_id),
    p_collection_id: ensureUUID(params.p_collection_id)
  });
}

export async function getProductsByCollection(collectionId: string): Promise<{ data: SupabaseProduct[] | null; error: Error | null }> {
  return await callRPC<SupabaseProduct[], { p_collection_id: string }>('get_products_by_collection', {
    p_collection_id: ensureUUID(collectionId)
  });
}

// Product service functions
export async function getUserProducts(): Promise<{ data: SupabaseProduct[] | null; error: Error | null }> {
  return await callRPC<SupabaseProduct[], {}>('get_user_products');
}

export async function createProduct(params: CreateProductParams): Promise<{ data: string | null; error: Error | null }> {
  const processedParams = {
    ...params,
    p_collection_id: params.p_collection_id ? ensureUUID(params.p_collection_id) : null
  };
  
  return await callRPC<string, CreateProductParams>('create_product', processedParams);
}

export async function updateProduct(params: UpdateProductParams): Promise<{ data: boolean | null; error: Error | null }> {
  const processedParams = {
    ...params,
    p_product_id: ensureUUID(params.p_product_id),
    p_collection_id: params.p_collection_id ? ensureUUID(params.p_collection_id) : null
  };
  
  return await callRPC<boolean, UpdateProductParams>('update_product', processedParams);
}

export async function deleteProduct(productId: string): Promise<{ data: boolean | null; error: Error | null }> {
  return await callRPC<boolean, DeleteProductParams>('delete_product', { 
    p_product_id: ensureUUID(productId) 
  });
}

export async function getProduct(productId: string): Promise<{ data: SupabaseProduct[] | null; error: Error | null }> {
  return await callRPC<SupabaseProduct[], { p_product_id: string }>('get_product', {
    p_product_id: ensureUUID(productId)
  });
}

// Product Notes service functions
export async function getProductNotes(productId: string): Promise<{ data: any[] | null; error: Error | null }> {
  return await callRPC<any[], { p_product_id: string }>('get_product_notes', {
    p_product_id: ensureUUID(productId)
  });
}

export async function saveProductNotes(productId: string, content: string): Promise<{ data: null; error: Error | null }> {
  return await callRPC<null, { p_product_id: string, p_content: string }>('save_product_notes', {
    p_product_id: ensureUUID(productId),
    p_content: content
  });
}

// Product Links service functions
export async function getProductLinks(productId: string): Promise<{ data: any[] | null; error: Error | null }> {
  return await callRPC<any[], { p_product_id: string }>('get_product_links', {
    p_product_id: ensureUUID(productId)
  });
}

export async function saveProductLink(
  productId: string,
  sourceName: string,
  productName: string,
  url: string,
  price?: number,
  rating?: number,
  reviewCount?: number
): Promise<{ data: string | null; error: Error | null }> {
  return await callRPC<string, any>('save_product_link', {
    p_product_id: ensureUUID(productId),
    p_source_name: sourceName,
    p_product_name: productName,
    p_url: url,
    p_price: price,
    p_rating: rating,
    p_review_count: reviewCount
  });
}

export async function deleteProductLink(linkId: string): Promise<{ data: boolean | null; error: Error | null }> {
  return await callRPC<boolean, { p_link_id: string }>('delete_product_link', {
    p_link_id: ensureUUID(linkId)
  });
}

// External Sources service functions
export async function getExternalSources(productId: string): Promise<{ data: any[] | null; error: Error | null }> {
  return await callRPC<any[], { p_product_id: string }>('get_external_sources', {
    p_product_id: ensureUUID(productId)
  });
}

export async function saveExternalSource(
  productId: string, 
  title: string, 
  url: string, 
  sourceType: 'youtube' | 'pinterest' | 'other'
): Promise<{ data: string | null; error: Error | null }> {
  return await callRPC<string, any>('save_external_source', {
    p_product_id: ensureUUID(productId),
    p_title: title,
    p_url: url,
    p_source_type: sourceType
  });
}

export async function deleteExternalSource(sourceId: string): Promise<{ data: boolean | null; error: Error | null }> {
  return await callRPC<boolean, { p_source_id: string }>('delete_external_source', {
    p_source_id: ensureUUID(sourceId)
  });
}
