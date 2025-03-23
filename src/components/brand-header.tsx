import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const BrandHeader = () => {

  return (
    <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="flex justify-between items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center gap-1">
                <div className="flex aspect-square size-8 w-8 h-8 bg-fuchsia-500 rounded-md"></div>

                <div className="truncate text-lg font-bold text-fuchsia-800">
                  Cooktopia
                </div>
              </div>
              <SidebarTrigger />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
  )
}

export default BrandHeader;
