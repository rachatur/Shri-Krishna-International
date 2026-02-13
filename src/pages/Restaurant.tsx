import { useEffect, useMemo, useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Wine, Coffee, UtensilsCrossed, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";

type AnyRecord = { [key: string]: unknown };
type UiOrder = { id: string; place: string; guest?: string; items: string; amount: number; time: string; status: string };
type UiMenu = { id: string; name: string; category: string; price: number; available: boolean };

const barSeed = [
  { order_id: "BO-301", table_name: "Bar 3", items: "Old Fashioned x2, Nachos", amount: 1850, order_time: "5 min ago", status: "Preparing" },
  { order_id: "BO-302", table_name: "Lounge 7", items: "Mojito, Caesar Salad", amount: 1200, order_time: "12 min ago", status: "Served" },
];
const menuSeed = [
  { item_name: "Butter Chicken", category: "Main Course", price: 450, is_available: 1 },
  { item_name: "Paneer Tikka", category: "Starters", price: 320, is_available: 1 },
  { item_name: "Chocolate Fondant", category: "Desserts", price: 280, is_available: 0 },
];
const roomServiceSeed = [
  { order_id: "RS-501", room_number: "301", guest_name: "Rajesh Kumar", items: "Club Sandwich, Coffee", amount: 680, status: "Preparing", order_time: "8 min ago" },
  { order_id: "RS-502", room_number: "201", guest_name: "Sarah Lee", items: "Continental Breakfast", amount: 950, status: "Delivering", order_time: "15 min ago" },
];

const formatCurrency = (value: number) => `INR ${value.toLocaleString("en-IN")}`;

const Restaurant = () => {
  const [barOrders, setBarOrders] = useState<UiOrder[]>([]);
  const [menuItems, setMenuItems] = useState<UiMenu[]>([]);
  const [roomServiceOrders, setRoomServiceOrders] = useState<UiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      setLoading(true);
      setError(null);
      try {
        const [barResult, menuResult, rsResult] = await Promise.all([
          getOrSeedFromAnyDoctype<AnyRecord>(["Bar Order", "Restaurant Order", "POS Order"], barSeed),
          getOrSeedFromAnyDoctype<AnyRecord>(["Menu Item", "Restaurant Menu", "Item"], menuSeed),
          getOrSeedFromAnyDoctype<AnyRecord>(["Room Service Order", "Hotel Room Service"], roomServiceSeed),
        ]);

        setBarOrders(
          barResult.data.map((o) => ({
            id: String(o.name ?? o.order_id ?? "N/A"),
            place: String(o.table_name ?? o.table ?? "Bar"),
            items: String(o.items ?? o.item_details ?? "-"),
            amount: Number(o.amount ?? o.total_amount ?? 0),
            time: String(o.order_time ?? o.time ?? "-"),
            status: String(o.status ?? "New"),
          }))
        );
        setMenuItems(
          menuResult.data.map((m) => ({
            id: String(m.name ?? m.item_code ?? m.item_name ?? "N/A"),
            name: String(m.item_name ?? m.name ?? "Menu Item"),
            category: String(m.category ?? m.item_group ?? "General"),
            price: Number(m.price ?? m.rate ?? 0),
            available: Boolean(m.is_available ?? m.available ?? true),
          }))
        );
        setRoomServiceOrders(
          rsResult.data.map((o) => ({
            id: String(o.name ?? o.order_id ?? "N/A"),
            place: String(o.room_number ?? o.room ?? "-"),
            guest: String(o.guest_name ?? o.guest ?? "Unknown Guest"),
            items: String(o.items ?? o.item_details ?? "-"),
            amount: Number(o.amount ?? o.total_amount ?? 0),
            time: String(o.order_time ?? o.time ?? "-"),
            status: String(o.status ?? "Preparing"),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load restaurant data from ERP");
      } finally {
        setLoading(false);
      }
    };
    void loadRestaurant();
  }, []);

  const activeOrders = barOrders.filter((o) => !["served", "delivered"].includes(o.status.toLowerCase())).length + roomServiceOrders.filter((o) => !["served", "delivered"].includes(o.status.toLowerCase())).length;
  const barRevenue = useMemo(() => barOrders.reduce((sum, o) => sum + (Number.isNaN(o.amount) ? 0 : o.amount), 0), [barOrders]);
  const roomServicePending = useMemo(() => roomServiceOrders.filter((o) => ["preparing", "delivering"].includes(o.status.toLowerCase())).length, [roomServiceOrders]);
  const dailyRevenue = barRevenue + roomServiceOrders.reduce((sum, o) => sum + (Number.isNaN(o.amount) ? 0 : o.amount), 0);

  return (
    <HotelLayout>
      <PageHeader title="Restaurant & Bar" description="Manage orders, menu, and room service" />
      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading restaurant data from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Orders" value={activeOrders} icon={<UtensilsCrossed className="h-5 w-5" />} variant="accent" />
        <StatCard title="Bar Revenue" value={formatCurrency(barRevenue)} subtitle="From ERP bar orders" icon={<Wine className="h-5 w-5" />} variant="info" />
        <StatCard title="Room Service" value={roomServicePending} subtitle="Pending" icon={<Coffee className="h-5 w-5" />} variant="warning" />
        <StatCard title="Daily Revenue" value={formatCurrency(dailyRevenue)} icon={<TrendingUp className="h-5 w-5" />} variant="success" />
      </div>

      <Tabs defaultValue="bar">
        <TabsList className="bg-secondary">
          <TabsTrigger value="bar">Bar Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="room-service">Room Service</TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
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
                  <tr key={o.id} className="border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0">
                    <td className="px-4 py-3 font-medium text-accent">{o.id}</td>
                    <td className="px-4 py-3 text-foreground">{o.place}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(o.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.time}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${o.status.toLowerCase() === "new" ? "bg-accent/15 text-accent-foreground" : o.status.toLowerCase() === "preparing" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>
                        {o.status}
                      </span>
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
              <div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.available ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                    {item.available ? "Available" : "Sold Out"}
                  </span>
                </div>
                <p className="mt-2 font-display text-lg font-bold text-accent">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="room-service">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
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
                  <tr key={o.id} className="border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0">
                    <td className="px-4 py-3 font-medium text-accent">{o.id}</td>
                    <td className="px-4 py-3 text-foreground">{o.place}</td>
                    <td className="px-4 py-3 text-foreground">{o.guest}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(o.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${o.status.toLowerCase() === "preparing" ? "bg-warning/15 text-warning" : o.status.toLowerCase() === "delivering" ? "bg-info/15 text-info" : "bg-success/15 text-success"}`}>
                        {o.status}
                      </span>
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
