const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const transformedItems = req.body.cart ? req.body.cart.map((item) => ({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: item.price * 100,

        product_data: {
          name: item.title,
          description: item.description,
        },
      },
    })) : [];
    console.log(transformedItems);
    try {
      // Create Checkout Sessions from body params.

      const session = await stripe.checkout.sessions.create({
        line_items: transformedItems,
        mode: 'payment',
        ...(req.body.user?.email && { customer_email: req.body.user?.email }),
        success_url: `${req.headers.origin}/courses/confirm-order?payment=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/courses/confirm-order?payment=false`,
      });
      console.log("yes returned", session.id);

      return res.status(200).json({ id: session.id });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
}
