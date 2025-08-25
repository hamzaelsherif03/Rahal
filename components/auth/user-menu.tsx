"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@supabase/supabase-js"

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseAvailable, setSupabaseAvailable] = useState(false)

  useEffect(() => {
    try {
      const supabase = createClient()
      if (supabase) {
        setSupabaseAvailable(true)

        const getUser = async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          setUser(user)
          setIsLoading(false)
        }

        getUser()

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null)
          setIsLoading(false)
        })

        return () => subscription.unsubscribe()
      }
    } catch (error) {
      console.log("[v0] Supabase not available, showing fallback UI")
      setSupabaseAvailable(false)
      setIsLoading(false)
    }
  }, [])

  const handleSignOut = async () => {
    if (!supabaseAvailable) return

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = "/"
    } catch (error) {
      console.log("[v0] Sign out failed, redirecting anyway")
      window.location.href = "/"
    }
  }

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
  }

  if (!supabaseAvailable) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => (window.location.href = "/auth/login")}
        className="font-medium"
      >
        Sign In
      </Button>
    )
  }

  const initials =
    user.user_metadata?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ||
    user.email?.[0].toUpperCase() ||
    "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt="Profile" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => (window.location.href = "/account")}>My Account</DropdownMenuItem>
        <DropdownMenuItem onClick={() => (window.location.href = "/account/orders")}>Order History</DropdownMenuItem>
        <DropdownMenuItem onClick={() => (window.location.href = "/account/wishlist")}>Wishlist</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
