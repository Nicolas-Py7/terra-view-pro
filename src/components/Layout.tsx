import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

export function Layout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-grid">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar title={title} subtitle={subtitle} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
