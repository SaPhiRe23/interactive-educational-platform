import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"
import { getSettings } from "@/lib/data"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const metadata = {
  title: "Panel administrativo | Festival del Patinódromo",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) {
    redirect("/login")
  }

  const settings = await getSettings()

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar eventName={settings.eventName} />
      <main className="flex-1 bg-muted/30 px-4 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
