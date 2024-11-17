import * as React from "react";
import { Clapperboard, Home, Popcorn, TvMinimalPlay, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

const data = {
  projects: [
    {
      name: "Home",
      url: "/",
      icon: Home,
    },
    {
      name: "Movies",
      url: "/movies",
      icon: Popcorn,
    },
    {
      name: "Tv Shows",
      url: "/tv-shows",
      icon: Clapperboard,
    },
    {
      name: "Watchlist",
      url: "/watchlist",
      icon: TvMinimalPlay,
    },
    {
      name: "Account",
      url: "/profile",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-[#212121]">
      <SidebarHeader className="bg-[#121212]">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="bg-[#121212]">
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="bg-[#121212]">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
