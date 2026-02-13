import { useEffect, useMemo, useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Package, AlertTriangle, TrendingDown, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";

type InventoryRecord = { [key: string]: unknown };
type UiInventory = { id: string; name: string; category: string; stock: number; minStock: number; unit: string };

const seedInventory = [
  { item_name: "Bed Linen Sets", category: "Housekeeping", stock_qty: 120, min_qty: 50, unit: "sets" },
  { item_name: "Towels (Bath)", category: "Housekeeping", stock_qty: 85, min_qty: 100, unit: "pcs" },
  { item_name: "Toiletries Kit", category: "Amenities", stock_qty: 200, min_qty: 80, unit: "kits" },
  { item_name: "Chicken", category: "Kitchen", stock_qty: 15, min_qty: 20, unit: "kg" },
  { item_name: "Rice", category: "Kitchen", stock_qty: 50, min_qty: 30, unit: "kg" },
  { item_name: "Detergent", category: "Laundry", stock_qty: 8, min_qty: 10, unit: "liters" },
];

const Inventory = () => {
  const [items, setItems] = useState<UiInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrSeedFromAnyDoctype<InventoryRecord>(
          ["Inventory Item", "Item", "Hotel Inventory", "Stock Item"],
          seedInventory
        );
        setItems(
          result.data.map((item) => ({
            id: String(item.name ?? item.item_code ?? item.item_name ?? "N/A"),
            name: String(item.item_name ?? item.name ?? "Item"),
            category: String(item.category ?? item.item_group ?? "General"),
            stock: Number(item.stock_qty ?? item.qty ?? item.current_stock ?? 0),
            minStock: Number(item.min_qty ?? item.reorder_level ?? item.minimum_stock ?? 0),
            unit: String(item.unit ?? item.stock_uom ?? "pcs"),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load inventory from ERP");
      } finally {
        setLoading(false);
      }
    };
    void loadInventory();
  }, []);

  const lowStock = useMemo(() => items.filter((i) => i.stock > 0 && i.stock <= i.minStock).length, [items]);
  const outOfStock = useMemo(() => items.filter((i) => i.stock <= 0).length, [items]);

  return (
    <HotelLayout>
      <PageHeader
        title="Inventory Management"
        description="Track and manage hotel supplies and stock"
        actions={
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Purchase Order
          </Button>
        }
      />
      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading inventory from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Items" value={items.length} icon={<Package className="h-5 w-5" />} variant="default" />
        <StatCard title="Low Stock" value={lowStock} icon={<AlertTriangle className="h-5 w-5" />} variant="warning" />
        <StatCard title="Out of Stock" value={outOfStock} icon={<TrendingDown className="h-5 w-5" />} variant="default" />
        <StatCard title="Pending Orders" value={0} icon={<ShoppingCart className="h-5 w-5" />} variant="info" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Min. Stock</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = item.stock <= 0 ? "Out of Stock" : item.stock <= item.minStock ? "Low Stock" : "In Stock";
              return (
                <tr key={item.id} className="border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3 text-foreground">{item.stock} {item.unit}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.minStock} {item.unit}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        status === "In Stock" ? "bg-success/15 text-success" : status === "Low Stock" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </HotelLayout>
  );
};

export default Inventory;
