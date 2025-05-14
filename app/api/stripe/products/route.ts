// app/api/stripe/products/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function GET() {
  try {
    console.log("API: Fetching products from Stripe....."); // Server log
    const products = await stripe.products.list({ limit: 10, active: true }); // Consider fetching only active products
    const prices = await stripe.prices.list({ limit: 10, active: true }); // Consider fetching only active prices

    console.log(
      `API: Fetched ${products.data.length} products, ${prices.data.length} prices.`
    ); // Server log

    const productMap = products.data.map((product) => {
      const productPrices = prices.data
        .filter((price) => price.product === product.id)
        .map((price) => ({
          id: price.id,
          unit_amount: price.unit_amount || 0,
          currency: price.currency,
          interval: price.recurring?.interval || "one_time",
          // Add nickname if you use it for plan tiers e.g. "Basic", "Premium"
          nickname: price.nickname,
        }));

      // If a product has no prices, you might want to exclude it or handle it
      if (productPrices.length === 0) {
        console.warn(
          `API: Product "${product.name}" (ID: ${product.id}) has no active prices. It will be excluded or have an empty prices array.`
        );
        // return null; // Option 1: Exclude it (then filter out nulls later)
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images, // Include images if you have them
        prices: productPrices,
        // Add product metadata if you use it
        metadata: product.metadata,
      };
    });
    // .filter(p => p !== null); // Option 1: If you returned null for products without prices

    console.log(
      "API: Successfully mapped products from Stripe. Mapped products count:",
      productMap.length
    ); // Server log
    return NextResponse.json({ products: productMap });
  } catch (err: any) {
    // Added :any to err for accessing err.message
    console.error(
      "API: Error fetching products/prices from Stripe:",
      err.message,
      err.stack
    ); // Server log, log full error
    // Provide more specific error to client if possible, but avoid leaking sensitive details
    return new NextResponse(
      JSON.stringify({
        error: "Failed to fetch Stripe data",
        details: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
