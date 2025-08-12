import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (step: string, details?: any) => {
  console.log(`[CREATE-CHECKOUT] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const supabase = createClient(supabaseUrl, supabaseAnon);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");
    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr) throw new Error(`Auth error: ${userErr.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email missing");

    const body = await req.json().catch(() => ({}));
    const plan = (body.plan || "starter").toLowerCase(); // 'starter' | 'pro'
    const interval = (body.interval || "month").toLowerCase(); // 'month' | 'year'

    const validPlans = ["starter", "pro"];
    const validIntervals = ["month", "year"];
    if (!validPlans.includes(plan)) throw new Error("Invalid plan");
    if (!validIntervals.includes(interval)) throw new Error("Invalid interval");

    const pricingEUR: Record<string, Record<string, number>> = {
      starter: { month: 9700, year: 93000 },
      pro: { month: 29700, year: 285000 },
    };

    const amount = pricingEUR[plan][interval];

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Ensure a customer exists
    let customerId: string | undefined;
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const created = await stripe.customers.create({ email: user.email, metadata: { supabase_uid: user.id } });
      customerId = created.id;
    }

    const origin = req.headers.get("origin") || "https://ijybwfdkiteebytdwhyu.supabase.co";

    const nameBase = plan === "starter" ? "Starter" : "Pro";
    const name = `${nameBase} ${interval === "month" ? "Monthly" : "Yearly"}`;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name },
            unit_amount: amount,
            recurring: { interval: interval as "month" | "year" },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${origin}/app?checkout=success`,
      cancel_url: `${origin}/app?checkout=cancel`,
    });

    log("Session created", { id: session.id, url: session.url, plan, interval });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log("ERROR", { message });
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
