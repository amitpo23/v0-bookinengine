"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromoCodesManagement } from "@/components/admin/promo-codes-management"
import { LoyaltyMembersManagement } from "@/components/admin/loyalty-members-management"
import { AffiliateAnalytics } from "@/components/admin/affiliate-analytics"
import { Tag, Crown, LinkIcon } from "lucide-react"

export function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState("promo")

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">מערכות שיווק ומכירות</h1>
        <p className="text-muted-foreground mt-2">
          ניהול קודי פרומו, מועדון לקוחות ו-Affiliate tracking
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="promo" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            קודי פרומו
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            מועדון לקוחות
          </TabsTrigger>
          <TabsTrigger value="affiliate" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Affiliate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promo">
          <PromoCodesManagement />
        </TabsContent>

        <TabsContent value="loyalty">
          <LoyaltyMembersManagement />
        </TabsContent>

        <TabsContent value="affiliate">
          <AffiliateAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
