import { useEffect, useMemo, useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Shirt, Clock, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";

type LaundryRecord = { [key: string]: unknown };
type UiLaundry = { id: string; room: string; guest: string; items: string; type: string; status: string; eta: string };

const seedLaundry = [
  { order_id: "LN-401", room_number: "301", guest_name: "Rajesh Kumar", items: "3 Shirts, 2 Trousers", service_type: "Express", status: "In Progress", eta: "2 hours" },
  { order_id: "LN-402", room_number: "201", guest_name: "Sarah Lee", items: "1 Dress, 2 Blouses", service_type: "Regular", status: "Ready", eta: "-" },
  { order_id: "LN-403", room_number: "410", guest_name: "Vikram Singh", items: "5 Shirts, 3 Trousers, 2 Suits", service_type: "Express", status: "Picked Up", eta: "4 hours" },
  { order_id: "LN-404", room_number: "102", guest_name: "James Wilson", items: "2 Shirts", service_type: "Regular", status: "Delivered", eta: "-" },
];

const Laundry = () => {
  const [orders, setOrders] = useState<UiLaundry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLaundry = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrSeedFromAnyDoctype<LaundryRecord>(["Laundry Order", "Hotel Laundry", "Laundry"], seedLaundry);
        setOrders(
          result.data.map((o) => ({
            id: String(o.name ?? o.order_id ?? "N/A"),
            room: String(o.room_number ?? o.room ?? "-"),
            guest: String(o.guest_name ?? o.guest ?? "Unknown Guest"),
            items: String(o.items ?? o.item_details ?? "-"),
            type: String(o.service_type ?? o.type ?? "Regular"),
            status: String(o.status ?? "In Progress"),
            eta: String(o.eta ?? o.expected_time ?? "-"),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load laundry orders from ERP");
      } finally {
        setLoading(false);
      }
    };
    void loadLaundry();
  }, []);

  const inProgress = useMemo(() => orders.filter((o) => o.status.toLowerCase() === "in progress").length, [orders]);
  const completed = useMemo(() => orders.filter((o) => ["delivered", "ready"].includes(o.status.toLowerCase())).length, [orders]);

  return (
    <HotelLayout>
      <PageHeader title="Laundry Service" description="Manage guest laundry orders and tracking" />
      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading laundry from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard title="Active Orders" value={orders.length} icon={<Shirt className="h-5 w-5" />} variant="info" />
        <StatCard title="In Progress" value={inProgress} icon={<Clock className="h-5 w-5" />} variant="warning" />
        <StatCard title="Completed Today" value={completed} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Room</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guest</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ETA</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0">
                <td className="px-4 py-3 font-medium text-accent">{o.id}</td>
                <td className="px-4 py-3 text-foreground">{o.room}</td>
                <td className="px-4 py-3 text-foreground">{o.guest}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${o.type.toLowerCase() === "express" ? "bg-accent/15 text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {o.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      o.status.toLowerCase() === "in progress"
                        ? "bg-warning/15 text-warning"
                        : o.status.toLowerCase() === "ready"
                          ? "bg-info/15 text-info"
                          : o.status.toLowerCase() === "picked up"
                            ? "bg-accent/15 text-accent-foreground"
                            : "bg-success/15 text-success"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{o.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HotelLayout>
  );
};

export default Laundry;
