import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const user = process.env.EMAIL_HOST_USER || "tridevx9@gmail.com";
  const pass = process.env.EMAIL_HOST_PASSWORD || "";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

const FROM_SENDER = `"Gadhinglaj Models Club Atelier" <${process.env.EMAIL_HOST_USER || "tridevx9@gmail.com"}>`;

/**
 * Send an itemized luxury invoice email to the customer
 */
export async function sendInvoiceEmail(order: {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  items: Array<{
    name: string;
    qty: number;
    size: string;
    color?: string;
    price: number;
  }>;
  amount: number;
  subtotal?: number;
  discount?: number;
  delivery?: number;
  tax?: number;
  payment: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}) {
  if (!order.email || !order.email.includes("@")) {
    console.warn("Cannot send invoice email: order has no valid email address.", order.id);
    return { success: false, error: "No recipient email specified" };
  }

  try {
    const transporter = getTransporter();

    const formattedAddress = [
      order.shippingAddress?.street,
      order.shippingAddress?.city,
      order.shippingAddress?.state,
      order.shippingAddress?.pincode,
    ]
      .filter(Boolean)
      .join(", ") || "In-Studio Collection / Address Confirmed via Concierge";

    const invoiceNo = `GMC-INV-${order.id.replace(/\D/g, "") || order.id}`;

    const itemsRowsHtml = order.items
      .map(
        (item, idx) => `
        <tr style="border-bottom: 1px solid #f0eae1;">
          <td style="padding: 14px 10px; font-family: 'Georgia', serif; font-size: 14px; color: #1a1a1a;">
            <strong>${item.name}</strong>
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #71717a; margin-top: 3px;">
              Size: ${item.size}${item.color ? ` &middot; Color: ${item.color}` : ""} &middot; Qty: ${item.qty} &middot; HSN: 6204
            </div>
          </td>
          <td style="padding: 14px 10px; text-align: right; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 600;">
            &#8377;${(item.price * item.qty).toLocaleString("en-IN")}
          </td>
        </tr>`
      )
      .join("");

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your Tax Invoice ${invoiceNo} - Gadhinglaj Models Club</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #27272a;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f4ef; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e7dfd5;">
          
          <!-- Atelier Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A0E17 0%, #722F37 50%, #2b080d 100%); padding: 40px 30px; text-align: center; color: #ffffff;">
              <div style="display: inline-block; padding: 6px 16px; border-radius: 50px; background: rgba(212, 175, 55, 0.2); border: 1px solid rgba(212, 175, 55, 0.4); font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #f5d77f; margin-bottom: 12px;">
                Official Boutique Tax Invoice &middot; ${invoiceNo}
              </div>
              <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 28px; font-weight: 400; letter-spacing: 1px; color: #ffffff;">
                GADHINGLAJ MODELS CLUB
              </h1>
              <p style="margin: 6px 0 0; font-size: 12px; color: #e4d5b7; font-weight: 300; letter-spacing: 1.5px; text-transform: uppercase;">
                Haute Couture Atelier &amp; Luxury Dress Rental Studio &middot; by Priyanka Desai
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: #ffffff; opacity: 0.8;">
                Tilak Path, Near Shivaji Bank, Main Road, Gadhinglaj, Maharashtra 416502
              </p>
            </td>
          </tr>

          <!-- Confirmation & Status Pill -->
          <tr>
            <td style="padding: 30px 30px 20px; text-align: center;">
              <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 6px 18px; border-radius: 50px; font-size: 12px; font-weight: 600;">
                &#10003; Payment Verified via Razorpay
              </div>
              <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #18181b; margin: 16px 0 6px;">
                Thank You for Your Order, ${order.customer}
              </h2>
              <p style="margin: 0; font-size: 13px; color: #71717a; line-height: 1.5;">
                Your order reference <strong style="color: #722F37;">#${order.id}</strong> has been confirmed. Our bespoke atelier team is preparing your selected silhouettes with satin-cover packaging.
              </p>
            </td>
          </tr>

          <!-- Order Metadata Bar -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf7f2; border: 1px solid #ebd8bf; border-radius: 12px; padding: 14px 18px;">
                <tr>
                  <td width="33%" style="font-size: 11px; color: #71717a;">
                    <span style="display: block; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; color: #a1a1aa; font-weight: 700;">Order Date</span>
                    <strong style="color: #18181b; font-size: 12px;">${order.date}</strong>
                  </td>
                  <td width="33%" style="font-size: 11px; color: #71717a; text-align: center;">
                    <span style="display: block; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; color: #a1a1aa; font-weight: 700;">Payment Mode</span>
                    <strong style="color: #18181b; font-size: 12px;">Razorpay</strong>
                  </td>
                  <td width="34%" style="font-size: 11px; color: #71717a; text-align: right;">
                    <span style="display: block; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; color: #a1a1aa; font-weight: 700;">Transaction ID</span>
                    <strong style="color: #047857; font-size: 11px; font-family: monospace;">${order.razorpayPaymentId || "Verified Online"}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr style="border-bottom: 2px solid #e7dfd5;">
                    <th align="left" style="padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a;">Silhouette / Item</th>
                    <th align="right" style="padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRowsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals Calculation -->
          <tr>
            <td style="padding: 0 30px 25px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13px; color: #52525b;">
                ${order.subtotal ? `
                <tr>
                  <td>Subtotal</td>
                  <td align="right">&#8377;${order.subtotal.toLocaleString("en-IN")}</td>
                </tr>` : ""}
                ${order.discount ? `
                <tr>
                  <td style="color: #9f1239;">Promotional Savings</td>
                  <td align="right" style="color: #9f1239;">&minus; &#8377;${order.discount.toLocaleString("en-IN")}</td>
                </tr>` : ""}
                <tr>
                  <td>Insured Express Delivery</td>
                  <td align="right" style="color: #047857;">${order.delivery && order.delivery > 0 ? `&#8377;${order.delivery}` : "Complimentary"}</td>
                </tr>
                ${order.tax ? `
                <tr>
                  <td>Taxes &amp; GST</td>
                  <td align="right">&#8377;${order.tax.toLocaleString("en-IN")}</td>
                </tr>` : ""}
                <tr style="border-top: 2px solid #e7dfd5;">
                  <td style="padding-top: 12px; font-family: 'Georgia', serif; font-size: 16px; font-weight: bold; color: #18181b;">
                    Grand Total Paid
                  </td>
                  <td align="right" style="padding-top: 12px; font-family: 'Georgia', serif; font-size: 22px; font-weight: bold; color: #722F37;">
                    &#8377;${order.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Destination -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #faf7f2; border: 1px solid #ebd8bf; border-radius: 12px; padding: 16px 20px;">
                <span style="display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #b45309; margin-bottom: 6px;">
                  Delivery Destination
                </span>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #27272a;">
                  <strong>Recipient:</strong> ${order.customer} (${order.phone})<br>
                  <strong>Address:</strong> ${formattedAddress}
                </p>
              </div>
            </td>
          </tr>

          <!-- Support & WhatsApp CTA -->
          <tr>
            <td style="padding: 0 30px 35px; text-align: center;">
              <p style="font-size: 12px; color: #71717a; margin-bottom: 16px;">
                Have a fitting or dispatch inquiry? Connect directly with our concierge team.
              </p>
              <a href="https://wa.me/919699620950?text=Hi%20GMC,%20regarding%20my%20order%20${order.id}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 50px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
                Connect with Concierge on WhatsApp
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #18181b; padding: 25px 30px; text-align: center; color: #a1a1aa; font-size: 11px;">
              <p style="margin: 0 0 6px; color: #f5d77f; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Gadhinglaj Models Club Atelier
              </p>
              <p style="margin: 0 0 4px; line-height: 1.4;">
                Shop No 1, Near Shivaji Bank, Main Road, Tilak Path, Gadhinglaj, Maharashtra 416502
              </p>
              <p style="margin: 0; color: #71717a;">
                Helpline: +91 96996 20950 &middot; Email: gandhiglaj@gmail.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: FROM_SENDER,
      to: order.email,
      subject: `Invoice & Confirmation for Order #${order.id} | Gadhinglaj Models Club`,
      html: htmlContent,
    });

    console.log("Invoice email successfully dispatched:", info.messageId, "to", order.email);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send invoice email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send a warm bespoke welcome email when a user registers or logs in
 */
export async function sendWelcomeEmail(user: {
  name?: string;
  email: string;
}) {
  if (!user.email || !user.email.includes("@")) {
    return { success: false, error: "Invalid user email" };
  }

  try {
    const transporter = getTransporter();
    const displayName = user.name || user.email.split("@")[0] || "Valued Patron";

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to Gadhinglaj Models Club</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #27272a;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f4ef; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e7dfd5;">
          
          <!-- Atelier Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A0E17 0%, #722F37 50%, #2b080d 100%); padding: 45px 30px; text-align: center; color: #ffffff;">
              <div style="display: inline-block; padding: 6px 16px; border-radius: 50px; background: rgba(212, 175, 55, 0.2); border: 1px solid rgba(212, 175, 55, 0.4); font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #f5d77f; margin-bottom: 12px;">
                Couture Membership
              </div>
              <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 30px; font-weight: 400; letter-spacing: 1px; color: #ffffff;">
                Welcome to GMC Atelier
              </h1>
              <p style="margin: 6px 0 0; font-size: 12px; color: #e4d5b7; font-weight: 300; letter-spacing: 1.5px; text-transform: uppercase;">
                by Priyanka Desai &middot; Gadhinglaj
              </p>
            </td>
          </tr>

          <!-- Welcome Body -->
          <tr>
            <td style="padding: 35px 30px 20px;">
              <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #18181b; margin: 0 0 14px;">
                Dear ${displayName},
              </h2>
              <p style="font-size: 14px; line-height: 1.7; color: #52525b; margin: 0 0 16px;">
                It is our absolute pleasure to welcome you to the <strong>Gadhinglaj Models Club Atelier</strong>. You are now part of an exclusive circle celebrating bespoke bridal couture, designer reception silks, and luxury photoshoot rental wardrobes.
              </p>
              <p style="font-size: 14px; line-height: 1.7; color: #52525b; margin: 0 0 24px;">
                Whether preparing for an unforgettable wedding ceremony, pre-wedding shoot, or festival gala, our design atelier provides custom fitting trials and hand-finished craftsmanship tailored to your exact silhouette.
              </p>

              <!-- Atelier Highlights -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding: 14px 18px; background-color: #faf7f2; border: 1px solid #ebd8bf; border-radius: 12px;">
                    <div style="font-size: 13px; font-weight: 600; color: #722F37; margin-bottom: 4px;">
                      &#10022; Exclusive Patron Privileges:
                    </div>
                    <ul style="margin: 6px 0 0 16px; padding: 0; font-size: 13px; color: #52525b; line-height: 1.6;">
                      <li><strong>Instant Online Purchases</strong> with secure 256-bit Razorpay UPI &amp; Cards</li>
                      <li><strong>3-Day Luxury Rental Studio</strong> booking for gowns &amp; lehengas</li>
                      <li><strong>Complimentary Alterations</strong> at our Tilak Path boutique</li>
                      <li><strong>Live Tracking &amp; Invoices</strong> saved directly to your account</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Buttons -->
              <div style="text-align: center; margin: 30px 0 10px;">
                <a href="https://gadhinglajmodelsclub.com/shop" style="display: inline-block; background-color: #722F37; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(114, 47, 55, 0.3); margin-right: 8px; margin-bottom: 8px;">
                  Explore Designer Collection
                </a>
                <a href="https://gadhinglajmodelsclub.com/rental" style="display: inline-block; background-color: #ffffff; color: #722F37; border: 1px solid #722F37; text-decoration: none; padding: 13px 28px; border-radius: 50px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">
                  Rental Studio
                </a>
              </div>
            </td>
          </tr>

          <!-- Studio Address -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="border-top: 1px solid #e7dfd5; padding-top: 20px; font-size: 12px; color: #71717a; text-align: center;">
                <p style="margin: 0 0 4px;">
                  We look forward to welcoming you in person at our flagship studio:
                </p>
                <strong style="color: #18181b;">Shop No 1, Near Shivaji Bank, Main Road, Tilak Path, Gadhinglaj, Maharashtra 416502</strong>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #18181b; padding: 25px 30px; text-align: center; color: #a1a1aa; font-size: 11px;">
              <p style="margin: 0 0 6px; color: #f5d77f; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Gadhinglaj Models Club Atelier
              </p>
              <p style="margin: 0; color: #71717a;">
                Personal Stylist Concierge: +91 96996 20950 &middot; Email: gandhiglaj@gmail.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: FROM_SENDER,
      to: user.email,
      subject: `Welcome to Gadhinglaj Models Club Atelier, ${displayName}!`,
      html: htmlContent,
    });

    console.log("Welcome email sent successfully:", info.messageId, "to", user.email);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send an alert to boutique admin and confirmation to customer when an inquiry is received from Visit page
 */
export async function sendInquiryEmail(inquiry: {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  preferredDate?: string;
  preferredTime?: string;
  message: string;
}) {
  try {
    const transporter = getTransporter();
    const adminEmail = process.env.EMAIL_HOST_USER || "tridevx9@gmail.com";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Atelier Visit Inquiry</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px; color: #2D1820;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #E8DFD8; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    <div style="text-align: center; border-bottom: 1px solid #F0E8E2; pb: 20px; margin-bottom: 24px;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #9C7A4A; font-weight: 700;">Gadhinglaj Models Club Atelier</span>
      <h2 style="margin: 8px 0 0; color: #3B1220; font-size: 24px;">New Client Visit &amp; Inquiry</h2>
      <p style="margin: 4px 0 0; color: #71717A; font-size: 12px;">Reference: #${inquiry.id}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 0; color: #71717A; font-size: 13px; width: 40%;">Client Name:</td>
        <td style="padding: 8px 0; color: #2D1820; font-weight: 600; font-size: 14px;">${inquiry.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #71717A; font-size: 13px;">Phone / WhatsApp:</td>
        <td style="padding: 8px 0; color: #2D1820; font-weight: 600; font-size: 14px;">
          <a href="https://wa.me/91${inquiry.phone.replace(/[^0-9]/g, "")}" style="color: #059669; text-decoration: none;">${inquiry.phone} (Open WhatsApp)</a>
        </td>
      </tr>
      ${inquiry.email ? `
      <tr>
        <td style="padding: 8px 0; color: #71717A; font-size: 13px;">Email:</td>
        <td style="padding: 8px 0; color: #2D1820; font-size: 14px;"><a href="mailto:${inquiry.email}" style="color: #3B1220;">${inquiry.email}</a></td>
      </tr>` : ""}
      <tr>
        <td style="padding: 8px 0; color: #71717A; font-size: 13px;">Occasion / Purpose:</td>
        <td style="padding: 8px 0; color: #9C7A4A; font-weight: 600; font-size: 14px;">${inquiry.subject}</td>
      </tr>
      ${inquiry.preferredDate ? `
      <tr>
        <td style="padding: 8px 0; color: #71717A; font-size: 13px;">Preferred Visit Date:</td>
        <td style="padding: 8px 0; color: #2D1820; font-weight: 600; font-size: 14px;">${inquiry.preferredDate} ${inquiry.preferredTime ? `(${inquiry.preferredTime})` : ""}</td>
      </tr>` : ""}
    </table>

    <div style="background: #FAF7F2; border-radius: 12px; padding: 16px; border: 1px solid #EAE0D5; margin-bottom: 24px;">
      <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #71717A; display: block; margin-bottom: 6px;">Client Message / Fitting Notes:</span>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #2D1820;">${inquiry.message || "No additional notes provided."}</p>
    </div>

    <div style="text-align: center; border-top: 1px solid #F0E8E2; pt: 20px;">
      <a href="https://wa.me/91${inquiry.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(inquiry.name)},%20thank%20you%20for%20inquiring%20with%20Gadhinglaj%20Models%20Club%20Atelier!" style="display: inline-block; background: #059669; color: #ffffff; padding: 10px 24px; border-radius: 24px; text-decoration: none; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
        Reply on WhatsApp
      </a>
    </div>
  </div>
</body>
</html>`;

    // 1. Notify Admin
    await transporter.sendMail({
      from: FROM_SENDER,
      to: adminEmail,
      subject: `New Visit Inquiry #${inquiry.id} from ${inquiry.name} (${inquiry.subject})`,
      html: htmlContent,
    }).catch((err) => console.warn("Admin inquiry notification email failed:", err.message));

    // 2. If client provided valid email, send confirmation
    if (inquiry.email && inquiry.email.includes("@")) {
      const clientContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Visit Inquiry Received</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px; color: #2D1820;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #E8DFD8; padding: 32px;">
    <div style="text-align: center; border-bottom: 1px solid #F0E8E2; pb: 20px; margin-bottom: 20px;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #9C7A4A; font-weight: 700;">Gadhinglaj Models Club Atelier</span>
      <h2 style="margin: 8px 0 0; color: #3B1220; font-size: 22px;">Inquiry Confirmed</h2>
      <p style="margin: 4px 0 0; color: #71717A; font-size: 12px;">Reference: #${inquiry.id}</p>
    </div>
    <p style="font-size: 14px; line-height: 1.6;">Dear <strong>${inquiry.name}</strong>,</p>
    <p style="font-size: 13px; line-height: 1.6; color: #52525B;">
      Thank you for connecting with our studio for your <strong>${inquiry.subject}</strong>${inquiry.preferredDate ? ` scheduled for trial around <strong>${inquiry.preferredDate}</strong>` : ""}.
      Our head stylist Priyanka Desai will contact you via WhatsApp or phone shortly to confirm trial availability.
    </p>
    <div style="margin-top: 24px; padding: 14px; background: #FAF7F2; border-radius: 12px; font-size: 12px; color: #71717A;">
      <strong>Atelier Location:</strong> Near Shivaji Bank, Tilak Path, Gadhinglaj<br>
      <strong>Helpline / WhatsApp:</strong> +91 96996 20950 &middot; Open all 7 days (10 AM - 9 PM)
    </div>
  </div>
</body>
</html>`;

      await transporter.sendMail({
        from: FROM_SENDER,
        to: inquiry.email,
        subject: `We've Received Your Visit Inquiry #${inquiry.id} | Gadhinglaj Models Club`,
        html: clientContent,
      }).catch((err) => console.warn("Client inquiry confirmation email failed:", err.message));
    }

    return { success: true };
  } catch (error: any) {
    console.error("sendInquiryEmail error:", error);
    return { success: false, error: error.message };
  }
}
