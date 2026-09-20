import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const siteUrl = Deno.env.get("SITE_URL")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Missing Authorization header", { status: 401, headers: corsHeaders });
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  const { productId } = await req.json();

  const { data: product, error: productError } = await supabaseClient
    .from("products")
    .select("id, name, price, sold_out")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product) {
    return new Response("Product not found", { status: 404, headers: corsHeaders });
  }

  if (product.sold_out) {
    return new Response("Product is sold out", { status: 409, headers: corsHeaders });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: Math.round(product.price * 100),
          product_data: { name: product.name },
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/products`,
    metadata: {
      product_id: product.id,
      user_id: user.id,
    },
  });

  return Response.json({ url: session.url }, { headers: corsHeaders });
});
