import { supabase } from "../lib/supabaseClient";

export const createCheckoutSession = async (productId: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke<{ url: string }>(
    "create-checkout-session",
    { body: { productId } },
  );

  if (error) throw error;

  const checkoutUrl = data?.url;
  if (!checkoutUrl) throw new Error("No checkout URL returned");

  return checkoutUrl;
};
