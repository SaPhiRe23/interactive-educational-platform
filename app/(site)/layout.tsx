import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSettings } from "@/lib/data"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader eventName={settings.eventName} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        eventName={settings.eventName}
        eventDates={settings.eventDates}
        eventLocation={settings.eventLocation}
      />
    </div>
  )
}
