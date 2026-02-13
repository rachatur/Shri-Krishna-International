import { useEffect, useMemo, useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Trash2, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";

type WasteRecord = { [key: string]: unknown };
type UiWaste = { id: string; date: string; category: string; weight: number; disposal: string; cost: number };

const seedWaste = [
  { waste_date: "2026-02-09", category: "Kitchen - Food", weight_kg: 12, disposal: "Composting", cost: 240 },
  { waste_date: "2026-02-09", category: "Housekeeping - Linen", weight_kg: 3, disposal: "Recycling", cost: 0 },
  { waste_date: "2026-02-08", category: "Kitchen - Packaging", weight_kg: 8, disposal: "Recycling", cost: 0 },
  { waste_date: "2026-02-08", category: "Bar - Glass", weight_kg: 5, disposal: "Recycling", cost: 0 },
  { waste_date: "2026-02-07", category: "Kitchen - Food", weight_kg: 15, disposal: "Composting", cost: 300 },
];

const formatCurrency = (value: number) => `INR ${value.toLocaleString("en-IN")}`;
const formatDate = (value: unknown) => {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const Waste = () => {
  const [log, setLog] = useState<UiWaste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWaste = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrSeedFromAnyDoctype<WasteRecord>(["Waste Log", "Hotel Waste", "Waste Management"], seedWaste);
        setLog(
          result.data.map((w, index) => ({
            id: String(w.name ?? `waste-${index}`),
            date: formatDate(w.waste_date ?? w.date),
            category: String(w.category ?? "General"),
            weight: Number(w.weight_kg ?? w.weight ?? 0),
            disposal: String(w.disposal ?? "Recycling"),
            cost: Number(w.cost ?? w.disposal_cost ?? 0),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load waste data from ERP");
      } finally {
        setLoading(false);
      }
    };
    void loadWaste();
  }, []);

  const totalWaste = useMemo(() => log.reduce((sum, w) => sum + (Number.isNaN(w.weight) ? 0 : w.weight), 0), [log]);
  const recycledWeight = useMemo(
    () => log.filter((w) => w.disposal.toLowerCase() === "recycling").reduce((sum, w) => sum + w.weight, 0),
    [log]
  );
  const recycledPct = totalWaste > 0 ? Math.round((recycledWeight / totalWaste) * 100) : 0;
  const totalCost = useMemo(() => log.reduce((sum, w) => sum + (Number.isNaN(w.cost) ? 0 : w.cost), 0), [log]);

  return (
    <HotelLayout>
      <PageHeader title="Waste Management" description="Track waste generation, disposal methods, and sustainability metrics" />
      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading waste logs from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Waste (Week)" value={`${totalWaste} kg`} icon={<Trash2 className="h-5 w-5" />} variant="default" />
        <StatCard title="Recycled" value={`${recycledPct}%`} icon={<TrendingDown className="h-5 w-5" />} variant="success" />
        <StatCard title="Disposal Cost" value={formatCurrency(totalCost)} subtitle="From ERP logs" icon={<Trash2 className="h-5 w-5" />} variant="warning" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Weight</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Disposal</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cost</th>
            </tr>
          </thead>
          <tbody>
            {log.map((w) => (
              <tr key={w.id} className="border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{w.date}</td>
                <td className="px-4 py-3 text-foreground">{w.category}</td>
                <td className="px-4 py-3 text-foreground">{w.weight} kg</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${w.disposal.toLowerCase() === "composting" ? "bg-success/15 text-success" : "bg-info/15 text-info"}`}>
                    {w.disposal}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatCurrency(w.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HotelLayout>
  );
};

export default Waste;
