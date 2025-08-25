"use client"

import { useState, useEffect } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  created_at: string
  users: {
    full_name: string
  }
}

interface ReviewsListProps {
  productId: string
}

export function ReviewsList({ productId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setReviews([])
      setIsLoading(false)
      return
    }

    if (!supabase) {
      setIsLoading(false)
      return
    }

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          title,
          comment,
          created_at,
          users (
            full_name
          )
        `)
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setReviews(data)
      }
      setIsLoading(false)
    }

    fetchReviews()
  }, [productId, supabase])

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No reviews yet. Be the first to review this product!</div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Customer Reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  By {review.users?.full_name || "Anonymous"} • {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-sm">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
