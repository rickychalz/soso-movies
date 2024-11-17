

import {
  type LucideIcon,
} from "lucide-react"


import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  //useSidebar,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  //const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name} className="">
            
            <SidebarMenuButton asChild className="text-lg font-medium text-white hover:text-white mb-4 hover:bg-teal-600 flex items-center gap-3">
            <NavLink to={item.url}
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold  bg-teal-600"
                : "text-white hover:text-white"
            }
            >
                <item.icon  size={32}/>
                <span>{item.name}</span>
                </NavLink>
            </SidebarMenuButton>
           
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
