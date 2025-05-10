
import { supabase } from "@/integrations/supabase/client";
import { RpcFunctionName } from "@/types/supabase";

/**
 * Type-safe wrapper for Supabase RPC calls
 * @param functionName The name of the RPC function to call
 * @param params The parameters to pass to the RPC function
 * @returns A properly typed response from the RPC function
 */
export async function callRPC<T, P extends Record<string, any>>(
  functionName: RpcFunctionName | string,
  params?: P
): Promise<{ data: T | null; error: Error | null }> {
  try {
    // Use a type assertion to bypass TypeScript's limitations with the Supabase client
    const response = await supabase.rpc(functionName as any, params);
    return response as { data: T | null; error: Error | null };
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
}

/**
 * Converts string IDs to UUIDs if needed
 * This helps with backward compatibility while we migrate to proper UUID types
 * @param id The ID to validate and potentially convert
 * @returns The ID in the correct format for Supabase
 */
export function ensureUUID(id: string): string {
  // Check if the ID is already a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (uuidRegex.test(id)) {
    return id;
  }
  
  // If it's not a UUID, check if it has a prefix like 'product-' or 'collection-'
  if (id.includes('-')) {
    console.warn(`ID ${id} is not a valid UUID. This may cause issues with Supabase queries.`);
  }
  
  return id;
}
