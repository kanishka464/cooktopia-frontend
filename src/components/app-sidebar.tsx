import * as React from "react";
import {
  PersonStanding,
  CookingPot,
  Frame,
  Map,
  PieChart,
  UserRound,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import BrandHeader from "@/components/brand-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: localStorage.getItem("user") || "Default User",
    email: "m@example.com",
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${localStorage.getItem(
      "userImage"
    )}&radius=50&backgroundColor=65c9ff,b6e3f4,ffdfbf,ffd5dc,d1d4f9,c0aede&backgroundType=gradientLinear,solid`,
    user_id: localStorage.getItem("user_id") || "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Recipes",
      url: "recipes",
      icon: CookingPot,
    },
    {
      title: "Community",
      url: "community",
      icon: PersonStanding,
    },
    {
      title: "Profile",
      url: `profile/${localStorage.getItem('user_id')}`,
      icon: UserRound,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BrandHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
