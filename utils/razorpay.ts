import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID || "mock_key_id";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "mock_key_secret";

export const razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});
