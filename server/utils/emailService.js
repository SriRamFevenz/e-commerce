const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendOrderConfirmationEmail = async (to, order, paymentUrl) => {
  try {
    const info = await transporter.sendMail({
      from: `"Luma Store" <${process.env.EMAIL_FROM || "sriram_luma@protonmail.com"}>`,
      to: to,
      subject: `Order Confirmation - #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your order!</h2>
          <p>Hi there,</p>
          <p>Your order has been placed successfully. Please complete your payment to process the order.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${paymentUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Pay Now</a>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #666;">
            Or copy this link: <br>
            <a href="${paymentUrl}">${paymentUrl}</a>
          </p>

          <h3>Items:</h3>
          <ul>
            ${order.items.map(item => `
              <li>
                ${item.quantity}x Product ID: ${item.product} - $${item.price.toFixed(2)}
              </li>
            `).join('')}
          </ul>

          <p>We will notify you when your order ships.</p>
          <p>Best regards,<br>Luma Store Team</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error to prevent blocking order creation flow
    return null;
  }
}


exports.sendPaymentSuccessEmail = async (to, order) => {
  try {
    const info = await transporter.sendMail({
      from: `"Luma Store" <${process.env.EMAIL_FROM || "sriram_luma@protonmail.com"}>`,
      to: to,
      subject: `Payment Received - Order #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Payment Successful!</h2>
          <p>Hi there,</p>
          <p>We have received your payment for Order #${order._id}.</p>
          
          <div style="background-color: #f0fff4; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #c3e6cb;">
            <p><strong>Amount Paid:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p><strong>Transaction Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Status:</strong> Paid</p>
          </div>

          <p>Your order is now being processed and will be shipped soon.</p>
          
          <p>Thank you for shopping with us!</p>
          <p>Best regards,<br>Luma Store Team</p>
        </div>
      `,
    });

    console.log("Payment success email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending payment success email:", error);
    return null;
  }
};
