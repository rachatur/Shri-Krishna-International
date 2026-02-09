import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Wine, Coffee, UtensilsCrossed, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const barOrders = [
  { id: "BO-301", table: "Bar 3", items: "Old Fashioned x2, Nachos", amount: "₹1,850", time: "5 min ago", status: "Preparing" },
  { id: "BO-302", table: "Lounge 7", items: "Mojito, Caesar Salad", amount: "₹1,200", time: "12 min ago", status: "Served" },
  { id: "BO-303", table: "Pool Bar", items: "Beer Bucket, Fries", amount: "₹2,100", time: "20 min ago", status: "Served" },
  { id: "BO-304", table: "Bar 1", items: "Whiskey Sour, Bruschetta", amount: "₹1,650", time: "2 min ago", status: "New" },
];

const menuItems = [
  { name: "Butter Chicken", category: "Main Course", price: "₹450", available: true },
  { name: "Paneer Tikka", category: "Starters", price: "₹320", available: true },
  { name: "Dal Makhani", category: "Main Course", price: "₹280", available: true },
  { name: "Caesar Salad", category: "Salads", price: "₹350", available: true },
  { name: "Chocolate Fondant", category: "Desserts", price: "₹280", available: false },
  { name: "Grilled Salmon", category: "Main Course", price: "₹850", available: true },
];

const roomServiceOrders = [
  { id: "RS-501", room: "301", guest: "Rajesh Kumar", items: "Club Sandwich, Coffee", amount: "₹680", time: "8 min ago", status: "Preparing" },
  { id: "RS-502", room: "201", guest: "Sarah Lee", items: "Continental Breakfast", amount: "₹950", time: "15 min ago", status: "Delivering" },
  { id: "RS-503", room: "410", guest: "Vikram Singh", items: "Lobster, Wine", amount: "₹4,200", time: "25 min ago", status: "Delivered" },
];

const Restaurant = () => {
  return (
    <HotelLayout>
      <PageHeader title="Restaurant & Bar" description="Manage orders, menu, and room service" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Orders" value={12} icon={<UtensilsCrossed className="h-5 w-5" />} variant="accent" />
        <StatCard title="Bar Revenue" value="₹45,800" subtitle="Today" icon={<Wine className="h-5 w-5" />} variant="info" />
        <StatCard title="Room Service" value={8} subtitle="Pending" icon={<Coffee className="h-5 w-5" />} variant="warning" />
        <StatCard title="Daily Revenue" value="₹1,24,500" icon={<TrendingUp className="h-5 w-5" />} trend={{ value: "8% up", positive: true }} variant="success" />
      </div>

      <Tabs defaultValue="bar">
        <TabsList className="bg-secondary">
          <TabsTrigger value="bar">Bar Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="room-service">Room Service</TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Table</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {barOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-accent">{o.id}</td>
                    <td className="px-4 py-3 text-foreground">{o.table}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{o.amount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.time}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        o.status === "New" ? "bg-accent/15 text-accent-foreground" :
                        o.status === "Preparing" ? "bg-warning/15 text-warning" :
                        "bg-success/15 text-success"
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="menu">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div key={item.name} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.available ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                    {item.available ? "Available" : "Sold Out"}
                  </span>
                </div>
                <p className="mt-2 font-display text-lg font-bold text-accent">{item.price}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="room-service">
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Room</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guest</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {roomServiceOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-accent">{o.id}</td>
                    <td className="px-4 py-3 text-foreground">{o.room}</td>
                    <td className="px-4 py-3 text-foreground">{o.guest}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{o.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        o.status === "Preparing" ? "bg-warning/15 text-warning" :
                        o.status === "Delivering" ? "bg-info/15 text-info" :
                        "bg-success/15 text-success"
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </HotelLayout>
  );
};

export default Restaurant;
