// api/stripe-webhook.js — Vercel Serverless Function
// Deploy this in each dashboard repo (or a shared repo)
// Env vars needed in Vercel:
//   STRIPE_SECRET_KEY       = sk_live_...
//   STRIPE_WEBHOOK_SECRET   = whsec_...
//   SUPABASE_URL            = https://jzqgndcrukggcwthxyrv.supabase.co
//   SUPABASE_SERVICE_KEY    = (service role key, NOT anon)

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe    = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase  = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PACKAGES = {
  spark:   200,
  insight: 400,
  oracle:  1000,
};

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session  = event.data.object;
    const client   = session.metadata?.client;
    const pkg      = session.metadata?.package;   // 'spark' | 'insight' | 'oracle'
    const credits  = PACKAGES[pkg];

    if (!client || !credits) {
      console.error("Missing metadata:", session.metadata);
      return res.status(400).send("Missing metadata");
    }

    // Upsert balance
    const { data: existing } = await supabase
      .from("ai_credits")
      .select("balance")
      .eq("client", client)
      .single();

    const newBalance = (existing?.balance || 0) + credits;

    await supabase.from("ai_credits").upsert(
      { client, balance: newBalance, updated_at: new Date().toISOString() },
      { onConflict: "client" }
    );

    // Log transaction
    await supabase.from("ai_transactions").insert({
      client,
      credits,
      type:      "purchase",
      package:   pkg,
      stripe_id: session.id,
    });

    console.log(`✓ ${client} purchased ${pkg} (+${credits} credits)`);
  }

  res.json({ received: true });
}
