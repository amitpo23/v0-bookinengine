/**
 * Mobile Drawer Component for Admin Sidebar
 * Uses vaul for smooth drawer experience
 */

'use client'

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface AdminDrawerProps {
  activeTab: string
  onTabChange: (tab: string) => void
  hotelName: string
}

export function AdminDrawer({ activeTab, onTabChange, hotelName }: AdminDrawerProps) {
  const [open, setOpen] = useState(false)

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setOpen(false) // Close drawer after selection
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-4 right-4 z-50"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">פתח תפריט</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-[300px] ml-auto">
        <div className="h-full overflow-y-auto">
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            hotelName={hotelName}
            collapsed={false}
            onCollapsedChange={() => {}}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
