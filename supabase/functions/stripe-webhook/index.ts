import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

Deno.serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  if (!signature) {
    return new Response("Missing Stripe-Signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (error) {
    console.error("Webhook signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.product_id;
    const userId = session.metadata?.user_id;
    const amountTotal = (session.amount_total ?? 0) / 100;

    if (productId && userId) {
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({ user_id: userId, status: "paid", total: amountTotal })
        .select()
        .single();

      if (orderError) {
        console.error("Failed to create order", orderError);
        return new Response("Failed to record order", { status: 500 });
      }

      const { error: itemError } = await supabaseAdmin.from("order_items").insert({
        order_id: order.id,
        product_id: productId,
        quantity: 1,
        unit_price: amountTotal,
      });

      if (itemError) {
        console.error("Failed to record order item", itemError);
      }

      const { error: productUpdateError } = await supabaseAdmin
        .from("products")
        .update({ sold_out: true })
        .eq("id", productId);

      if (productUpdateError) {
        console.error("Failed to mark product sold out", productUpdateError);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
