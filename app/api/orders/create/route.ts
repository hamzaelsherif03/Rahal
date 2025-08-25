import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { sendOrderConfirmation } from "@/lib/email/send-email"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Order service unavailable" }, { status: 503 })
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Order service unavailable" }, { status: 503 })
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Generate order number
    const orderNumber = `SKT-${Date.now()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id,
        order_number: orderNumber,
        status: "pending",
        total_amount: orderData.total,
        subtotal: orderData.subtotal,
        shipping_amount: orderData.shipping,
        currency: orderData.currency || "USD",
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        shipping_address: orderData.shippingAddress,
        billing_address: orderData.billingAddress,
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
      product_name: item.productName,
      variant_details: {
        color: item.color,
        size: item.size,
      },
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    // Send order confirmation email
    await sendOrderConfirmation({
      orderNumber,
      createdAt: order.created_at,
      customerName: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
      customerEmail: orderData.customerEmail,
      items: orderData.items.map((item: any) => ({
        productName: item.productName,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
    })

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
