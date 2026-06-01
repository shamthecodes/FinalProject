import emailjs from "@emailjs/browser";

export const sendOrderEmail = async (
  order,
  address,
  items,
  otp = null,
  paymentMethod = "online",
) => {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Show exact values in console
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 EmailJS Config Check:");
    console.log("Service ID :", serviceId);
    console.log("Template ID:", templateId);
    console.log("Public Key :", publicKey?.slice(0, 8) + "...");
    console.log("To email   :", address?.email);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━");

    if (!serviceId || serviceId === "undefined") {
      console.error("❌ VITE_EMAILJS_SERVICE_ID is missing in .env");
      return false;
    }
    if (!templateId || templateId === "undefined") {
      console.error("❌ VITE_EMAILJS_TEMPLATE_ID is missing in .env");
      return false;
    }
    if (!publicKey || publicKey === "undefined") {
      console.error("❌ VITE_EMAILJS_PUBLIC_KEY is missing in .env");
      return false;
    }

    const isCOD = paymentMethod === "cod";

    const itemsList = items
      .map(
        (item) =>
          `• ${item.name || item.product?.name} x${item.quantity} = ₹${(item.price * item.quantity).toLocaleString("en-IN")}`,
      )
      .join("\n");

    const otpSection =
      isCOD && otp
        ? `🔐 YOUR DELIVERY OTP: ${otp}\n\nShare this OTP ONLY with the delivery person.\nDo NOT share with anyone else.`
        : "";

    const templateParams = {
      to_email: address.email,
      customer_name: `${address.firstName} ${address.lastName}`,
      order_id: order.id?.slice(0, 8).toUpperCase(),
      items: itemsList,
      total: `₹${order.total?.toLocaleString("en-IN")}`,
      address: `${address.address}${address.landmark ? ", " + address.landmark : ""}, ${address.city}, ${address.state} - ${address.pincode}`,
      phone: address.phone,
      payment_method: isCOD ? "Cash on Delivery" : paymentMethod.toUpperCase(),
      otp_section: otpSection,
      track_link: `${window.location.origin}/track-order/${order.id}`,
    };

    console.log("📤 Sending with params:", templateParams);

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey,
    );
    console.log("✅ Email sent! Status:", response.status, response.text);
    return true;
  } catch (err) {
    console.error("❌ Email error:", err?.text || err?.message || err);
    return false;
  }
};
// const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

// export const sendOrderEmail = async (
//   order,
//   address,
//   items,
//   otp = null,
//   paymentMethod = "online",
// ) => {
//   try {
//     await fetch(`${SERVER}/api/trigger/order-confirmed`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ order, address, items, otp, paymentMethod }),
//     });
//     console.log("✅ Order email triggered via Inngest");
//     return true;
//   } catch (err) {
//     console.error("❌ Inngest trigger failed:", err);
//     return false;
//   }
// };
