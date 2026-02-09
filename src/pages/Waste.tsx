import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Trash2, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const wasteLog = [
  { date: "Feb 09", category: "Kitchen - Food", weight: "12 kg", disposal: "Composting", cost: "₹240" },
  { date: "Feb 09", category: "Housekeeping - Linen", weight: "3 kg", disposal: "Recycling", cost: "₹0" },
  { date: "Feb 08", category: "Kitchen - Packaging", weight: "8 kg", disposal: "Recycling", cost: "₹0" },
  { date: "Feb 08", category: "Bar - Glass", weight: "5 kg", disposal: "Recycling", cost: "₹0" },
  { date: "Feb 07", category: "Kitchen - Food", weight: "15 kg", disposal: "Composting", cost: "₹300" },
];

const Waste = () => (
  <HotelLayout>
    <PageHeader title="Waste Management" description="Track waste generation, disposal methods, and sustainability metrics" />
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      <StatCard title="Total Waste (Week)" value="156 kg" icon={<Trash2 className="h-5 w-5" />} variant="default" />
      <StatCard title="Recycled" value="68%" icon={<TrendingDown className="h-5 w-5" />} trend={{ value: "5% improvement", positive: true }} variant="success" />
      <StatCard title="Disposal Cost" value="₹3,200" subtitle="This week" icon={<Trash2 className="h-5 w-5" />} variant="warning" />
    </div>
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border bg-secondary/50">
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Weight</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Disposal</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cost</th>
        </tr></thead>
        <tbody>
          {wasteLog.map((w, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 text-muted-foreground">{w.date}</td>
              <td className="px-4 py-3 text-foreground">{w.category}</td>
              <td className="px-4 py-3 text-foreground">{w.weight}</td>
              <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${w.disposal === "Composting" ? "bg-success/15 text-success" : "bg-info/15 text-info"}`}>{w.disposal}</span></td>
              <td className="px-4 py-3 text-muted-foreground">{w.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </HotelLayout>
);

export default Waste;
