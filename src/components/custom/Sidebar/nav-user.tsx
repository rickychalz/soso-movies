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
import { Link, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {useState } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { user, logout } = useAuthStore();

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Replace `user?.token` with actual token if necessary
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      const data = await response.json();
      console.log(data.message); // Success or error message from the API
      logout();
      navigate("/")
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const getFirstLetter = (username: string) => {
    return username.charAt(0).toUpperCase(); // Get the first letter and make it uppercase
  };

  return (
    <>
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
                  <span className="truncate font-semibold">
                    {user?.username}
                  </span>
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

              <Link to="/profile">
                <DropdownMenuItem className="text-white focus:bg-teal-600 focus:text-white">
                  <User />
                  Account
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                className="text-white focus:bg-teal-600 focus:text-white"
                onClick={handleOpenModal}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent className="bg-[#212121] border-none text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>You are about to logout!</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to logout, Do you wish to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-teal-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600" onClick={handleLogout}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
