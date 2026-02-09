import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Package, AlertTriangle, TrendingDown, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const inventoryItems = [
  { name: "Bed Linen Sets", category: "Housekeeping", stock: 120, minStock: 50, unit: "sets", status: "ok" },
  { name: "Towels (Bath)", category: "Housekeeping", stock: 85, minStock: 100, unit: "pcs", status: "low" },
  { name: "Toiletries Kit", category: "Amenities", stock: 200, minStock: 80, unit: "kits", status: "ok" },
  { name: "Chicken (kg)", category: "Kitchen", stock: 15, minStock: 20, unit: "kg", status: "low" },
  { name: "Rice (kg)", category: "Kitchen", stock: 50, minStock: 30, unit: "kg", status: "ok" },
  { name: "Detergent", category: "Laundry", stock: 8, minStock: 10, unit: "liters", status: "low" },
];

const Inventory = () => (
  <HotelLayout>
    <PageHeader title="Inventory Management" description="Track and manage hotel supplies and stock" actions={<Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"><ShoppingCart className="mr-2 h-4 w-4" />Purchase Order</Button>} />
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Items" value={248} icon={<Package className="h-5 w-5" />} variant="default" />
      <StatCard title="Low Stock" value={12} icon={<AlertTriangle className="h-5 w-5" />} variant="warning" />
      <StatCard title="Out of Stock" value={3} icon={<TrendingDown className="h-5 w-5" />} variant="default" />
      <StatCard title="Pending Orders" value={5} icon={<ShoppingCart className="h-5 w-5" />} variant="info" />
    </div>
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border bg-secondary/50">
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stock</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Min. Stock</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
        </tr></thead>
        <tbody>
          {inventoryItems.map((item) => (
            <tr key={item.name} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
              <td className="px-4 py-3 text-foreground">{item.stock} {item.unit}</td>
              <td className="px-4 py-3 text-muted-foreground">{item.minStock} {item.unit}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${item.status === "ok" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                  {item.status === "ok" ? "In Stock" : "Low Stock"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </HotelLayout>
);

export default Inventory;
