import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Wifi } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/60 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-base font-semibold tracking-tight md:text-lg">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="hidden md:flex relative w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar sensores, dados..." className="pl-9 bg-input/40 border-border/60" />
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary pulse-ring" />
      </Button>
      <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs md:flex">
        <Wifi className="h-3.5 w-3.5 text-primary" />
        <span className="text-muted-foreground">Servidor</span>
        <span className="font-medium text-primary">conectado</span>
      </div>
    </header>
  );
}
