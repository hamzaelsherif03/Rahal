export const emailTemplates = {
  orderConfirmation: (orderData: any) => ({
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #475569; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 28px; font-weight: bold; color: #be123c; margin-bottom: 10px; }
            .content { background: white; padding: 30px; border: 1px solid #e5e5e5; }
            .order-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e5; }
            .total { font-weight: bold; font-size: 18px; color: #be123c; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #be123c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Rahal</div>
              <h1>Thank you for your order!</h1>
              <p>Your order has been confirmed and will be shipped soon.</p>
            </div>
            
            <div class="content">
              <h2>Order Details</h2>
              <div class="order-details">
                <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
                <p><strong>Customer:</strong> ${orderData.customerName}</p>
                <p><strong>Email:</strong> ${orderData.customerEmail}</p>
              </div>

              <h3>Items Ordered</h3>
              ${orderData.items
                .map(
                  (item: any) => `
                <div class="item">
                  <div>
                    <strong>${item.productName}</strong><br>
                    <small>${item.color} / ${item.size} × ${item.quantity}</small>
                  </div>
                  <div>$${(item.unitPrice * item.quantity).toFixed(2)}</div>
                </div>
              `,
                )
                .join("")}
              
              <div class="item">
                <div><strong>Subtotal</strong></div>
                <div>$${orderData.subtotal.toFixed(2)}</div>
              </div>
              <div class="item">
                <div><strong>Shipping</strong></div>
                <div>${orderData.shipping === 0 ? "Free" : "$" + orderData.shipping.toFixed(2)}</div>
              </div>
              <div class="item total">
                <div>Total</div>
                <div>$${orderData.total.toFixed(2)}</div>
              </div>

              <h3>Shipping Address</h3>
              <div class="order-details">
                <p>${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}</p>
                <p>${orderData.shippingAddress.address}</p>
                <p>${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}</p>
              </div>

              <p>We'll send you a shipping confirmation email with tracking information once your order ships.</p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders" class="button">Track Your Order</a>
            </div>

            <div class="footer">
              <p>Questions? Contact us at <a href="mailto:care@skirte.com">care@skirte.com</a></p>
              <p>&copy; ${new Date().getFullYear()} Rahal. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Thank you for your order!
      
      Order Number: ${orderData.orderNumber}
      Order Date: ${new Date(orderData.createdAt).toLocaleDateString()}
      
      Items:
      ${orderData.items.map((item: any) => `${item.productName} (${item.color}/${item.size}) x${item.quantity} - $${(item.unitPrice * item.quantity).toFixed(2)}`).join("\n")}
      
      Subtotal: $${orderData.subtotal.toFixed(2)}
      Shipping: ${orderData.shipping === 0 ? "Free" : "$" + orderData.shipping.toFixed(2)}
      Total: $${orderData.total.toFixed(2)}
      
      We'll send you tracking information once your order ships.
      
      Questions? Contact us at care@skirte.com
    `,
  }),

  welcomeEmail: (userData: any) => ({
    subject: "Welcome to Rahal - Your Journey Begins",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Rahal</title>
          <style>
            body { font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #475569; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 32px; font-weight: bold; color: #be123c; margin-bottom: 15px; }
            .content { background: white; padding: 30px; border: 1px solid #e5e5e5; }
            .feature { display: flex; align-items: center; margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
            .feature-icon { width: 40px; height: 40px; background: #be123c; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: white; font-weight: bold; }
            .button { display: inline-block; background: #be123c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Rahal</div>
              <h1>Welcome, ${userData.fullName}!</h1>
              <p>We're thrilled to have you join our community of style enthusiasts.</p>
            </div>
            
            <div class="content">
              <p>Dear ${userData.fullName},</p>
              
              <p>Welcome to Rahal, where elegance meets everyday sophistication. We're passionate about creating skirts that move with you and last beyond seasons.</p>

              <div class="feature">
                <div class="feature-icon">✨</div>
                <div>
                  <strong>Premium Quality</strong><br>
                  <small>Carefully crafted from the finest materials</small>
                </div>
              </div>

              <div class="feature">
                <div class="feature-icon">🚚</div>
                <div>
                  <strong>Free Shipping</strong><br>
                  <small>On orders over $150</small>
                </div>
              </div>

              <div class="feature">
                <div class="feature-icon">💝</div>
                <div>
                  <strong>Easy Returns</strong><br>
                  <small>30-day hassle-free returns</small>
                </div>
              </div>

              <p>Ready to discover your perfect skirt? Browse our collections and find pieces that speak to your style.</p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/collection/all" class="button">Start Shopping</a>

              <p>If you have any questions, our customer care team is here to help at <a href="mailto:care@skirte.com">care@skirte.com</a>.</p>
            </div>

            <div class="footer">
              <p>Follow us for style inspiration and exclusive offers</p>
              <p>&copy; ${new Date().getFullYear()} Rahal. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to Rahal, ${userData.fullName}!
      
      We're thrilled to have you join our community of style enthusiasts.
      
      At Rahal, we're passionate about creating skirts that move with you and last beyond seasons.
      
      What you can expect:
      - Premium quality materials and craftsmanship
      - Free shipping on orders over $150
      - Easy 30-day returns
      
      Ready to start shopping? Visit ${process.env.NEXT_PUBLIC_SITE_URL}
      
      Questions? Contact us at care@skirte.com
    `,
  }),

  newsletterTemplate: (content: any) => ({
    subject: content.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${content.subject}</title>
          <style>
            body { font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #475569; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 28px; font-weight: bold; color: #be123c; margin-bottom: 10px; }
            .content { background: white; padding: 30px; border: 1px solid #e5e5e5; }
            .button { display: inline-block; background: #be123c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; }
            .unsubscribe { color: #6b7280; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Rahal</div>
              <h1>${content.title}</h1>
            </div>
            
            <div class="content">
              ${content.body}
              
              ${
                content.ctaText && content.ctaUrl
                  ? `
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${content.ctaUrl}" class="button">${content.ctaText}</a>
                </p>
              `
                  : ""
              }
            </div>

            <div class="footer">
              <p>You're receiving this email because you subscribed to Rahal updates.</p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email={{email}}" class="unsubscribe">
                  Unsubscribe
                </a> | 
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="unsubscribe">
                  Visit our website
                </a>
              </p>
              <p>&copy; ${new Date().getFullYear()} Rahal. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      ${content.title}
      
      ${content.body.replace(/<[^>]*>/g, "")}
      
      ${content.ctaText && content.ctaUrl ? `${content.ctaText}: ${content.ctaUrl}` : ""}
      
      Unsubscribe: ${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe
    `,
  }),
}
