// app/checkout-sessions/route.ts
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// data needed for checkout
export interface CheckoutBody {
  line_items: any;
}

export async function POST(req: Request) {
  const body = (await req.json()) as CheckoutBody;

  try {
    //customer create
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: body.line_items,
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["BD"],
      },
      success_url: "http://localhost:3000/success",
      cancel_url: `http://localhost:3000/`,
    });
    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      const { message } = error;
      return NextResponse.json({ message }, { status: error.statusCode });
    }
  }
}
