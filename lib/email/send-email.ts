import { emailTemplates } from "./templates"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail(options: EmailOptions) {
  // In a real application, you would integrate with an email service like:
  // - Resend
  // - SendGrid
  // - AWS SES
  // - Mailgun

  // For now, we'll log the email (in production, replace with actual email service)
  console.log("[EMAIL] Sending email:", {
    to: options.to,
    subject: options.subject,
    preview: options.text.substring(0, 100) + "...",
  })

  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, messageId: `msg_${Date.now()}` })
    }, 100)
  })
}

export async function sendOrderConfirmation(orderData: any) {
  const template = emailTemplates.orderConfirmation(orderData)

  return sendEmail({
    to: orderData.customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}

export async function sendWelcomeEmail(userData: any) {
  const template = emailTemplates.welcomeEmail(userData)

  return sendEmail({
    to: userData.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}

export async function sendNewsletter(subscribers: string[], content: any) {
  const template = emailTemplates.newsletterTemplate(content)

  const promises = subscribers.map((email) =>
    sendEmail({
      to: email,
      subject: template.subject,
      html: template.html.replace("{{email}}", email),
      text: template.text,
    }),
  )

  return Promise.all(promises)
}
