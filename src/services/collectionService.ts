
import { supabase } from "@/integrations/supabase/client";
import { callRPC } from "@/utils/supabaseHelpers";
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
    p_collection_id: collectionId 
  });
}

export async function addProductToCollection(params: AddProductToCollectionParams): Promise<{ data: string | null; error: Error | null }> {
  return await callRPC<string, AddProductToCollectionParams>('add_product_to_collection', params);
}

export async function removeProductFromCollection(params: RemoveProductFromCollectionParams): Promise<{ data: boolean | null; error: Error | null }> {
  return await callRPC<boolean, RemoveProductFromCollectionParams>('remove_product_from_collection', params);
}

export async function getProductsByCollection(collectionId: string): Promise<{ data: SupabaseProduct[] | null; error: Error | null }> {
  return await callRPC<SupabaseProduct[], { p_collection_id: string }>('get_products_by_collection', {
    p_collection_id: collectionId
  });
}

// Product service functions
export async function getUserProducts(): Promise<{ data: SupabaseProduct[] | null; error: Error | null }> {
  return await callRPC<SupabaseProduct[], {}>('get_user_products');
}

export async function createProduct(params: CreateProductParams): Promise<{ data: string | null; error: Error | null }> {
  return await callRPC<string, CreateProductParams>('create_product', params);
}

export async function updateProduct(params: UpdateProductParams): Promise<{ data: boolean | null; error: Error | null }> {
  return await callRPC<boolean, UpdateProductParams>('update_product', params);
}

export async function deleteProduct(productId: string): Promise<{ data: boolean | null; error: Error | null }> {
  return await callRPC<boolean, DeleteProductParams>('delete_product', { 
    p_product_id: productId 
  });
}

export async function getProduct(productId: string): Promise<{ data: SupabaseProduct[] | null; error: Error | null }> {
  return await callRPC<SupabaseProduct[], { p_product_id: string }>('get_product', {
    p_product_id: productId
  });
}
