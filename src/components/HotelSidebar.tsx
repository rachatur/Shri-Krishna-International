import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  UserCheck,
  LogIn,
  LogOut,
  Receipt,
  UtensilsCrossed,
  Wine,
  BookOpen,
  ConciergeBell,
  Package,
  Trash2,
  Shirt,
  Plane,
  ChevronDown,
  Hotel,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Rooms", url: "/rooms", icon: BedDouble },
  { title: "Bookings", url: "/bookings", icon: CalendarCheck },
];

const frontDeskItems = [
  { title: "Self Check-in", url: "/self-checkin", icon: UserCheck },
  { title: "Counter Check-in", url: "/counter-checkin", icon: LogIn },
  { title: "Counter Check-out", url: "/counter-checkout", icon: LogOut },
];

const billingItems = [
  { title: "Billing", url: "/billing", icon: Receipt },
  { title: "Invoicing", url: "/invoicing", icon: Receipt },
];

const restaurantItems = [
  { title: "Bar Management", url: "/bar", icon: Wine },
  { title: "Menu Management", url: "/menu", icon: BookOpen },
  { title: "Room Service", url: "/room-service", icon: ConciergeBell },
];

const operationsItems = [
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Waste Management", url: "/waste", icon: Trash2 },
  { title: "Laundry Service", url: "/laundry", icon: Shirt },
  { title: "Travel Desk", url: "/travel-desk", icon: Plane },
];

interface SidebarSectionProps {
  label: string;
  items: { title: string; url: string; icon: React.ElementType }[];
  collapsed: boolean;
  currentPath: string;
}

function SidebarSection({ label, items, collapsed, currentPath }: SidebarSectionProps) {
  const isActive = items.some((i) => currentPath === i.url);

  if (collapsed) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                    <item.icon className="h-4 w-4" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <Collapsible defaultOpen={isActive || label === "Main"}>
      <SidebarGroup>
        <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
          {label}
          <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function HotelSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Hotel className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-display text-base font-bold text-sidebar-accent-foreground">Sri Krishna International</h1>
              <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50">Hotel Management</p>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarSection label="Main" items={mainItems} collapsed={collapsed} currentPath={currentPath} />
        <SidebarSection label="Front Desk" items={frontDeskItems} collapsed={collapsed} currentPath={currentPath} />
        <SidebarSection label="Billing" items={billingItems} collapsed={collapsed} currentPath={currentPath} />
        <SidebarSection label="Restaurant" items={restaurantItems} collapsed={collapsed} currentPath={currentPath} />
        <SidebarSection label="Operations" items={operationsItems} collapsed={collapsed} currentPath={currentPath} />
      </SidebarContent>
    </Sidebar>
  );
}
