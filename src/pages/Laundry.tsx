import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Shirt, Clock, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const laundryOrders = [
  { id: "LN-401", room: "301", guest: "Rajesh Kumar", items: "3 Shirts, 2 Trousers", type: "Express", status: "In Progress", eta: "2 hours" },
  { id: "LN-402", room: "201", guest: "Sarah Lee", items: "1 Dress, 2 Blouses", type: "Regular", status: "Ready", eta: "—" },
  { id: "LN-403", room: "410", guest: "Vikram Singh", items: "5 Shirts, 3 Trousers, 2 Suits", type: "Express", status: "Picked Up", eta: "4 hours" },
  { id: "LN-404", room: "102", guest: "James Wilson", items: "2 Shirts", type: "Regular", status: "Delivered", eta: "—" },
];

const Laundry = () => (
  <HotelLayout>
    <PageHeader title="Laundry Service" description="Manage guest laundry orders and tracking" />
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      <StatCard title="Active Orders" value={8} icon={<Shirt className="h-5 w-5" />} variant="info" />
      <StatCard title="In Progress" value={5} icon={<Clock className="h-5 w-5" />} variant="warning" />
      <StatCard title="Completed Today" value={12} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
    </div>
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border bg-secondary/50">
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Room</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guest</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">ETA</th>
        </tr></thead>
        <tbody>
          {laundryOrders.map((o) => (
            <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-accent">{o.id}</td>
              <td className="px-4 py-3 text-foreground">{o.room}</td>
              <td className="px-4 py-3 text-foreground">{o.guest}</td>
              <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
              <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${o.type === "Express" ? "bg-accent/15 text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{o.type}</span></td>
              <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                o.status === "In Progress" ? "bg-warning/15 text-warning" :
                o.status === "Ready" ? "bg-info/15 text-info" :
                o.status === "Picked Up" ? "bg-accent/15 text-accent-foreground" :
                "bg-success/15 text-success"
              }`}>{o.status}</span></td>
              <td className="px-4 py-3 text-muted-foreground">{o.eta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </HotelLayout>
);

export default Laundry;
