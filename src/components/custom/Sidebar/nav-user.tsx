import { ChevronsUpDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useAuthStore from "@/store/auth-context";
import { Link } from "react-router-dom";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { user, logout } = useAuthStore();

  const getFirstLetter = (username: string) => {
    return username.charAt(0).toUpperCase(); // Get the first letter and make it uppercase
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="focus:bg-teal-600 hover:bg-teal-600">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-teal-600 data-[state=open]:text-white hover:bg-teal-600 hover:text-white"
            >
              <Avatar className="h-8 w-8 rounded-lg text-black">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className="rounded-full ">
                  {getFirstLetter(user?.username || "")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.username}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-[#212121] border-none"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal text-white">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="rounded-lg text-black">
                    {getFirstLetter(user?.username || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.username}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <Link to="">
              <DropdownMenuItem className="text-white focus:bg-teal-600 focus:text-white">
                <User />
                Account
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem
              className="text-white focus:bg-teal-600 focus:text-white"
              onClick={logout}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
