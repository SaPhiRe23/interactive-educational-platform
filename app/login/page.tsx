import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"
import { LoginForm } from "@/components/admin/login-form"

export const metadata = {
  title: "Acceso administrador | Festival del Patinódromo",
}

export default async function LoginPage() {
  if (await isAdmin()) {
    redirect("/admin")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-heading text-lg font-bold">P</span>
          </span>
          <h1 className="mt-4 font-heading text-xl font-bold text-sidebar-foreground">Panel administrativo</h1>
          <p className="mt-1 text-sm text-sidebar-foreground/60">Festival del Patinódromo 2026</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
