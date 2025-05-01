
import { supabase } from "@/integrations/supabase/client";

/**
 * Type-safe wrapper for Supabase RPC calls
 * @param functionName The name of the RPC function to call
 * @param params The parameters to pass to the RPC function
 * @returns A properly typed response from the RPC function
 */
export async function callRPC<T, P extends Record<string, any>>(
  functionName: string,
  params?: P
): Promise<{ data: T | null; error: Error | null }> {
  const response = await supabase.rpc(functionName, params);
  return response as unknown as { data: T | null; error: Error | null };
}
