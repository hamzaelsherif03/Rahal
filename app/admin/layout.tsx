import type React from "react"
import { AdminNav } from "@/components/admin/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminNav />
      <main className="flex-1 overflow-auto lg:ml-0">{children}</main>
    </div>
  )
}
