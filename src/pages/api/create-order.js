import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { amount } = req.body;

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      payment_capture: 1,
    });

    res.status(200).json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating Razorpay order" });
  }
}
