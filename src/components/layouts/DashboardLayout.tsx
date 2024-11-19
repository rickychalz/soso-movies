import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../custom/Sidebar/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Search } from "lucide-react";

export function Layout() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      setQuery(""); 
    }
  };

  

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        {/* Sidebar */}
        <AppSidebar className="shrink-0 w-64" />

        {/* Content Area */}
        <SidebarInset className="flex-1 bg-[#121212] overflow-y-auto">
          <header className="sticky top-0 z-20 flex bg-[#121212] h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-8 w-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-white" />
            </div>
            <div className="flex items-center gap-4 flex-1">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center w-full max-w-full"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for movies"
                  className="bg-transparent text-white border border-[#212121] px-3 py-2 rounded-l-2xl focus:outline-none focus:ring-0 w-full sm:max-w-xs"
                />
                <button
                  type="submit"
                  className="bg-transparent py-2 border border-[#212121] px-2 rounded-r-2xl text-white"
                >
                  <Search size={24} />
                </button>
              </form>
            </div>
          </header>
          <div className="w-full">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
