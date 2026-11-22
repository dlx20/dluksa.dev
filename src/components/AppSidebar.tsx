"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { navLinks } from "@/lib/constants";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Socials from "@/components/Socials";

// Same rule as the header nav: "/projects/foo" still highlights Projects
const isActivePath = (pathname: string, url: string) =>
  pathname === url || (url !== "/" && pathname.startsWith(url));

export default function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile, toggleSidebar } = useSidebar();

  return (
    <Sidebar side="right" collapsible="offcanvas">
      <SidebarHeader className="flex-row items-center justify-between border-b border-sidebar-border px-4 py-3">
        <span className="text-body font-bold text-accent">
          ddev<span className="font-light text-fg-base">:</span>
          <span className="font-light text-primary">~$</span> menu
        </span>
        <button
          onClick={toggleSidebar}
          aria-label="Close menu"
          className="flex size-8 cursor-pointer items-center justify-center rounded-card border border-accent/25 bg-accent/5 text-accent transition-colors hover:bg-accent/15"
        >
          <FaTimes size={12} />
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-wide text-fg-muted">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navLinks.map(({ title, url }) => (
                <SidebarMenuItem key={url}>
                  <SidebarMenuButton
                    isActive={isActivePath(pathname, url)}
                    render={<Link href={url} />}
                    // On phones the menu covers the page, so close it after choosing
                    onClick={() => isMobile && setOpenMobile(false)}
                    className="tracking-default text-fg-muted"
                  >
                    {/* Shown like a shell path: "~ home", "~/projects"; screen readers skip the "~" */}
                    <span>
                      <span aria-hidden="true" className="text-primary">
                        {url === "/" ? "~ " : "~/"}
                      </span>
                      {url === "/" ? title.toLowerCase() : url.slice(1)}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup className="px-4 py-4">
          <ThemeSwitcher />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Socials />
      </SidebarFooter>
    </Sidebar>
  );
}
