// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Stripe = require("stripe");

async function CreateStripeSession(req, res) {
  const { item } = req.body;
  console.log(JSON.stringify(item));
  console.log("STRIPE_SECRET_KEY = " + item.STRIPE_SECRET_KEY);
  const stripe = Stripe(item.STRIPE_SECRET_KEY);

  const redirectURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://www.eventby.xyz";

  const transformedItem = {
    price_data: {
      currency: "usd",
      product_data: {
        images: [item.image],
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [transformedItem],
    mode: "payment",
    success_url: `https://www.eventby.xyz/organizer/accountsetting/subscription?session_id={CHECKOUT_SESSION_ID}`,
    // success_url: `http://localhost:3000/organizer/accountsetting/subscription?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: redirectURL + "?status=cancel",
    metadata: {
      images: item.image,
    },
  });

  res.send({ session });
}

export default CreateStripeSession;
