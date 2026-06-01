import { Resend } from "resend";

// eslint-disable-next-line no-undef
// ✅ Correct — Vite style
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
console.log(import.meta.env.VITE_RESEND_API_KEY);
export const sendOrderEmail = async (order, address, items) => {
  const itemsHTML = items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #f0e8dc;">
        ${item.product?.name || item.name}
      </td>
      <td style="padding:8px;border-bottom:1px solid #f0e8dc;text-align:center;">
        ${item.quantity}
      </td>
      <td style="padding:8px;border-bottom:1px solid #f0e8dc;text-align:right;">
        ₹${(item.price * item.quantity).toLocaleString("en-IN")}
      </td>
    </tr>
  `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Georgia', serif; background: #f7f0e9; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: #0d4d4d; padding: 32px; text-align: center; }
        .header h1 { color: white; font-size: 28px; margin: 0 0 4px; }
        .header p { color: rgba(255,255,255,0.6); font-size: 12px; letter-spacing: 3px; margin: 0; }
        .gold { color: #d4af37; }
        .body { padding: 32px; }
        .badge { background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); color: #0d4d4d; padding: 6px 14px; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f7f0e9; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; text-align: left; }
        .total-row { background: #0d4d4d; color: white; }
        .total-row td { padding: 12px 8px; font-weight: bold; }
        .footer { background: #0d4d4d; padding: 24px; text-align: center; }
        .footer p { color: rgba(255,255,255,0.5); font-size: 11px; margin: 4px 0; }
      </style>
    </head>
    <body>
      <div class="container">

        <!-- HEADER -->
        <div class="header">
          <p style="color:#d4af37;letter-spacing:3px;font-size:11px;">✦ JEWELS IN TRICE ✦</p>
          <h1>JewelsNow</h1>
          <p>ORDER CONFIRMED</p>
        </div>

        <!-- BODY -->
        <div class="body">
          <p style="font-size:20px;color:#0d4d4d;font-weight:bold;">
            Thank you, ${address?.firstName}! 🎉
          </p>
          <p style="color:#6b7280;font-size:14px;line-height:1.7;">
            Your order has been confirmed and is being carefully prepared. 
            You will receive another update once it ships.
          </p>

          <div class="badge">
            ORDER ID: #${order.id?.slice(0, 8).toUpperCase()}
          </div>

          <!-- ORDER ITEMS -->
          <h3 style="color:#0d4d4d;margin:24px 0 8px;font-size:16px;">Items Ordered</h3>
          <table>
            <tr>
              <th>Item</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Price</th>
            </tr>
            ${itemsHTML}
            <tr class="total-row">
              <td colspan="2">Total Paid</td>
              <td style="text-align:right;">₹${order.total?.toLocaleString("en-IN")}</td>
            </tr>
          </table>

          <!-- DELIVERY ADDRESS -->
          <h3 style="color:#0d4d4d;margin:24px 0 8px;font-size:16px;">Delivery Address</h3>
          <div style="background:#f7f0e9;border-radius:8px;padding:14px;font-size:14px;color:#374151;line-height:1.7;">
            <strong>${address?.firstName} ${address?.lastName}</strong><br>
            ${address?.address}${address?.landmark ? ", " + address.landmark : ""}<br>
            ${address?.city}, ${address?.state} - ${address?.pincode}<br>
            📞 ${address?.phone}
          </div>

          <!-- TRACK ORDER -->
          <div style="text-align:center;margin:28px 0;">
            <a href="http://localhost:5173/track-order/${order.id}"
               style="background:#0d4d4d;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:bold;letter-spacing:1px;">
              📍 TRACK YOUR ORDER
            </a>
          </div>

          <p style="font-size:13px;color:#9ca3af;text-align:center;">
            Questions? Reply to this email or WhatsApp us.
          </p>
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <p>✦ JewelsNow — Jewels in Trice ✦</p>
          <p>© ${new Date().getFullYear()} JewelsNow. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: "JewelsNow <orders@yourdomain.com>",
    to: address.email,
    subject: `✅ Order Confirmed — #${order.id?.slice(0, 8).toUpperCase()} | JewelsNow`,
    html: html,
  });

  console.log("✅ Order email sent to:", address.email);
};
