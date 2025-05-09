
import { supabase } from "@/integrations/supabase/client";
import { RpcFunctionName } from "@/types/supabase";

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
  try {
    // Use a type assertion to bypass TypeScript's limitations with the Supabase client
    const response = await supabase.rpc(functionName as any, params);
    return response as { data: T | null; error: Error | null };
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
}
