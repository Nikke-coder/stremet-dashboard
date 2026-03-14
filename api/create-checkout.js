// api/create-checkout.js — Vercel Serverless Function
// Env vars needed:
//   STRIPE_SECRET_KEY   = sk_live_...
//   NEXT_PUBLIC_URL     = https://your-dashboard.vercel.app  (no trailing slash)

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create these products+prices in Stripe dashboard first
// OR use price IDs from your Stripe account
const PRICE_IDS = {
  spark:   process.env.STRIPE_PRICE_SPARK,    // €10
  insight: process.env.STRIPE_PRICE_INSIGHT,  // €20
  oracle:  process.env.STRIPE_PRICE_ORACLE,   // €50
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { package: pkg, client } = req.body;

  if (!PRICE_IDS[pkg]) return res.status(400).json({ error: "Unknown package" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: PRICE_IDS[pkg], quantity: 1 }],
    metadata: { client, package: pkg },
    success_url: `${process.env.NEXT_PUBLIC_URL}?billing=success`,
    cancel_url:  `${process.env.NEXT_PUBLIC_URL}?billing=cancelled`,
    // Tax included in price — no automatic tax
    customer_email: undefined, // Stripe will ask
  });

  res.json({ url: session.url });
}
