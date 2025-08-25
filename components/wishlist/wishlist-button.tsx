"use client"

import { useState, useEffect } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return
    }

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Check if product is in wishlist
        const { data } = await supabase
          .from("wishlists")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .single()

        setIsInWishlist(!!data)
      }
    }

    getUser()
  }, [productId, supabase])

  const toggleWishlist = async () => {
    if (!isSupabaseConfigured() || !supabase || !user) {
      window.location.href = "/auth/login"
      return
    }

    setIsLoading(true)

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId)

        setIsInWishlist(false)
      } else {
        // Add to wishlist
        await supabase.from("wishlists").insert({
          user_id: user.id,
          product_id: productId,
        })

        setIsInWishlist(true)
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
    }

    setIsLoading(false)
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleWishlist} disabled={isLoading} className={className}>
      <Heart className={`w-4 h-4 ${isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
    </Button>
  )
}
