import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HotelSidebar } from "@/components/HotelSidebar";
import { Bell, Search, User, LogOut, CheckCircle2, CalendarClock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { KeyboardEvent, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HotelLayout({ children }: { children: React.ReactNode }) {
  const { logout, userEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "2 rooms pending housekeeping",
      icon: AlertTriangle,
      unread: true,
    },
    {
      id: "n2",
      title: "3 check-ins arriving in next 2 hours",
      icon: CalendarClock,
      unread: true,
    },
    {
      id: "n3",
      title: "Yesterday revenue report is ready",
      icon: CheckCircle2,
      unread: false,
    },
  ]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const displayName = userEmail ? userEmail.split("@")[0] : "admin";

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    toast({ title: "Notifications updated", description: "All notifications marked as read." });
  };

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    const term = search.trim().toLowerCase();
    if (!term) return;

    const routes: Array<{ keywords: string[]; path: string }> = [
      { keywords: ["dashboard", "home", "overview"], path: "/dashboard" },
      { keywords: ["room", "rooms"], path: "/rooms" },
      { keywords: ["booking", "bookings", "reservation"], path: "/bookings" },
      { keywords: ["checkin", "check-in", "walk-in"], path: "/counter-checkin" },
      { keywords: ["checkout", "check-out", "quick checkout"], path: "/counter-checkout" },
      { keywords: ["billing", "invoice", "invoicing"], path: "/billing" },
      { keywords: ["restaurant", "bar", "menu", "room service"], path: "/bar" },
      { keywords: ["inventory", "stock"], path: "/inventory" },
      { keywords: ["waste"], path: "/waste" },
      { keywords: ["laundry"], path: "/laundry" },
      { keywords: ["travel", "travel desk", "transport"], path: "/travel-desk" },
    ];

    const match = routes.find((route) => route.keywords.some((keyword) => term.includes(keyword)));
    if (match) {
      navigate(match.path);
      setSearch("");
      return;
    }

    toast({
      title: "No match found",
      description: "Try terms like rooms, bookings, billing, laundry, or travel desk.",
      variant: "destructive",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <HotelSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 shadow-card">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search rooms, guests, bookings..."
                  className="w-72 pl-9 bg-secondary border-none text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 ? (
                      <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                        {unreadCount}
                      </span>
                    ) : null}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <button className="text-xs text-accent hover:underline" onClick={markAllRead}>
                      Mark all read
                    </button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((item) => (
                    <DropdownMenuItem key={item.id} className="cursor-pointer py-2">
                      <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.title}</span>
                      {item.unread ? <span className="ml-auto h-2 w-2 rounded-full bg-accent" /> : null}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-secondary">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold capitalize">{displayName}</p>
                    <p className="text-xs font-normal text-muted-foreground">{userEmail ?? "admin@srikrishna.com"}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/counter-checkin")}>
                    Walk-in Check-in
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/counter-checkout")}>
                    Quick Checkout
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
