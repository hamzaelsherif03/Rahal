import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { sendWelcomeEmail } from "@/lib/email/send-email"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Newsletter service unavailable" }, { status: 503 })
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Newsletter service unavailable" }, { status: 503 })
    }

    // Check if already subscribed
    const { data: existing } = await supabase.from("newsletter_subscribers").select("id").eq("email", email).single()

    if (existing) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 200 })
    }

    // Add to newsletter
    const { error } = await supabase.from("newsletter_subscribers").insert({ email })

    if (error) {
      throw error
    }

    // Send welcome email
    await sendWelcomeEmail({
      email,
      fullName: "Valued Customer",
    })

    return NextResponse.json({ message: "Successfully subscribed" }, { status: 201 })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
