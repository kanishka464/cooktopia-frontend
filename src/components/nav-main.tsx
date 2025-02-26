import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const navigate = useNavigate()
  return (
    <SidebarGroup>
      <SidebarMenu className="flex flex-col gap-3">
        {items.map((item) => (
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate(`${item.url}`)} className="py-5 hover:bg-fuchsia-200" tooltip={item.title}>
                  {item.icon && <span className="text-xl"><item.icon /></span>}
                  <span className="font-semibold text-stone-700">{item.title}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
