"use client"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Users, Star, TrendingUp, Package, Mail } from "lucide-react"

export default async function AdminDashboard() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Admin Dashboard Unavailable</CardTitle>
            <CardDescription>Please configure database integration to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const supabase = await createClient()

  if (!supabase) {
    redirect("/")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch dashboard data with error handling
  const [
    { data: orders, count: ordersCount },
    { data: products, count: productsCount },
    { data: users, count: usersCount },
    { data: reviews, count: reviewsCount },
    { data: pendingReviews },
    { data: recentOrders },
    { data: topProducts },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact" })
      .limit(0)
      .then((res) => res || { data: null, count: 0 }),
    supabase
      .from("products")
      .select("*", { count: "exact" })
      .limit(0)
      .then((res) => res || { data: null, count: 0 }),
    supabase
      .from("users")
      .select("*", { count: "exact" })
      .limit(0)
      .then((res) => res || { data: null, count: 0 }),
    supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("is_approved", true)
      .limit(0)
      .then((res) => res || { data: null, count: 0 }),
    supabase
      .from("reviews")
      .select(`
      id, title, rating, created_at,
      products(name),
      users(full_name)
    `)
      .eq("is_approved", false)
      .limit(5)
      .then((res) => res || { data: [] }),
    supabase
      .from("orders")
      .select(`
      id, order_number, total_amount, status, created_at,
      users(full_name)
    `)
      .order("created_at", { ascending: false })
      .limit(5)
      .then((res) => res || { data: [] }),
    supabase
      .from("order_items")
      .select(`
      product_id, product_name, quantity,
      products(name)
    `)
      .limit(10)
      .then((res) => res || { data: [] }),
  ])

  const stats = [
    {
      title: "Total Orders",
      value: ordersCount || 0,
      icon: ShoppingBag,
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Total Products",
      value: productsCount || 0,
      icon: Package,
      change: "+3",
      changeType: "positive",
    },
    {
      title: "Total Users",
      value: usersCount || 0,
      icon: Users,
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Approved Reviews",
      value: reviewsCount || 0,
      icon: Star,
      change: "+15%",
      changeType: "positive",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your Rahal store</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders?.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">{order.users?.full_name || "Guest"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total_amount}</p>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground text-center py-4">No orders yet</p>}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Pending Reviews
                </CardTitle>
                <CardDescription>Reviews awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingReviews?.map((review) => (
                    <div key={review.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {review.products?.name} • {review.users?.full_name}
                          </p>
                        </div>
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
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground text-center py-4">No pending reviews</p>}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Package className="w-6 h-6" />
                  Add Product
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Users className="w-6 h-6" />
                  Manage Users
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Mail className="w-6 h-6" />
                  Send Newsletter
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <TrendingUp className="w-6 h-6" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
