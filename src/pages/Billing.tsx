import { useEffect, useMemo, useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Receipt, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";

type InvoiceRecord = { [key: string]: unknown };
type UiInvoice = { id: string; guest: string; room: string; amount: number; date: string; status: string };

const invoiceSeedData = [
  { invoice_number: "INV-2041", guest_name: "Vikram Singh", room_number: "410", amount: 184200, date: "2026-02-12", status: "Paid" },
  { invoice_number: "INV-2042", guest_name: "Emily Clark", room_number: "201", amount: 12800, date: "2026-02-10", status: "Paid" },
  { invoice_number: "INV-2043", guest_name: "James Wilson", room_number: "102", amount: 7600, date: "2026-02-11", status: "Pending" },
  { invoice_number: "INV-2044", guest_name: "Rajesh Kumar", room_number: "301", amount: 38400, date: "2026-02-12", status: "Pending" },
  { invoice_number: "INV-2045", guest_name: "David Chen", room_number: "112", amount: 4180, date: "2026-02-10", status: "Overdue" },
];

const formatCurrency = (value: number) => `INR ${value.toLocaleString("en-IN")}`;
const formatDate = (value: unknown) => {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const Billing = () => {
  const [invoices, setInvoices] = useState<UiInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrSeedFromAnyDoctype<InvoiceRecord>(["Sales Invoice", "Invoice", "Hotel Invoice", "Billing"], invoiceSeedData);
        setInvoices(
          result.data.map((inv) => ({
            id: String(inv.name ?? inv.invoice_number ?? inv.invoice_id ?? "N/A"),
            guest: String(inv.guest_name ?? inv.customer_name ?? inv.guest ?? "Unknown Guest"),
            room: String(inv.room_number ?? inv.room_no ?? inv.room ?? "-"),
            amount: Number(inv.amount ?? inv.total_amount ?? inv.grand_total ?? 0),
            date: formatDate(inv.date ?? inv.posting_date ?? inv.invoice_date),
            status: String(inv.status ?? inv.payment_status ?? "Pending"),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invoices from ERP");
      } finally {
        setLoading(false);
      }
    };
    void loadInvoices();
  }, []);

  const paid = useMemo(() => invoices.filter((i) => i.status.toLowerCase() === "paid").length, [invoices]);
  const pending = useMemo(() => invoices.filter((i) => i.status.toLowerCase() === "pending").length, [invoices]);
  const overdue = useMemo(() => invoices.filter((i) => i.status.toLowerCase() === "overdue").length, [invoices]);
  const totalRevenue = useMemo(() => invoices.reduce((sum, i) => sum + (Number.isNaN(i.amount) ? 0 : i.amount), 0), [invoices]);

  return (
    <HotelLayout>
      <PageHeader title="Billing & Invoicing" description="Manage payments, invoices, and financial reports" />
      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading billing from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} subtitle="From ERP invoices" icon={<Receipt className="h-5 w-5" />} variant="accent" />
        <StatCard title="Paid Invoices" value={paid} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
        <StatCard title="Pending" value={pending} icon={<Clock className="h-5 w-5" />} variant="warning" />
        <StatCard title="Overdue" value={overdue} icon={<AlertCircle className="h-5 w-5" />} variant="default" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guest</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Room</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0">
                <td className="px-4 py-3 font-medium text-accent">{inv.id}</td>
                <td className="px-4 py-3 text-foreground">{inv.guest}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.room}</td>
                <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(inv.amount)}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      inv.status.toLowerCase() === "paid"
                        ? "bg-success/15 text-success"
                        : inv.status.toLowerCase() === "pending"
                          ? "bg-warning/15 text-warning"
                          : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HotelLayout>
  );
};

export default Billing;
