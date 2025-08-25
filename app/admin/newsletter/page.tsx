"use client"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, Users, Send, Plus } from "lucide-react"

export default async function NewsletterManagement() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Newsletter Management Unavailable</CardTitle>
            <CardDescription>Please configure database integration to manage newsletters.</CardDescription>
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

  // Fetch newsletter subscribers
  const { data: subscribers, count: subscribersCount } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("subscribed_at", { ascending: false })
    .then((res) => res || { data: [], count: 0 })

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Newsletter</h1>
            <p className="text-muted-foreground">Manage subscribers and send campaigns</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscribersCount || 0}</div>
                <p className="text-xs text-muted-foreground">Active subscribers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">New subscribers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Campaign</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Open rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Send Newsletter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Newsletter
                </CardTitle>
                <CardDescription>Create and send a newsletter to all subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input id="subject" placeholder="Enter email subject" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="title">Newsletter Title</Label>
                    <Input id="title" placeholder="Main headline" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your newsletter content here..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cta-text">Call-to-Action Text</Label>
                      <Input id="cta-text" placeholder="Shop Now" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cta-url">Call-to-Action URL</Label>
                      <Input id="cta-url" placeholder="https://..." className="mt-1" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline">
                      Preview
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      <Send className="w-4 h-4 mr-2" />
                      Send to {subscribersCount || 0} subscribers
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Recent Subscribers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Subscribers
                </CardTitle>
                <CardDescription>Latest newsletter signups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subscribers?.slice(0, 8).map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{subscriber.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                        {subscriber.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  )) || <p className="text-muted-foreground text-center py-4">No subscribers yet</p>}
                </div>

                {subscribers && subscribers.length > 8 && (
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Subscribers
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
