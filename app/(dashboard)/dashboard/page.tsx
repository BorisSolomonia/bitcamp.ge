import Link from "next/link"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import SubscriptionsList from "@/components/subscriptions-list"

export const metadata = {
  title: "შეძენილი სერვისები",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="ჩემი სივრცე" text="">
        {/* <PostCreateButton /> */}
      </DashboardHeader>
      <div>
        <section className="container space-y-6 bg-slate-50 dark:bg-transparent ">
          <SubscriptionsList />
        </section>
      </div>
    </DashboardShell>
  )
}
