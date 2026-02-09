import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Receipt, CheckCircle, Clock, AlertCircle } from "lucide-react";

const invoices = [
  { id: "INV-2041", guest: "Vikram Singh", room: "410", amount: "₹1,84,200", date: "Feb 12", status: "Paid" },
  { id: "INV-2042", guest: "Emily Clark", room: "201", amount: "₹12,800", date: "Feb 10", status: "Paid" },
  { id: "INV-2043", guest: "James Wilson", room: "102", amount: "₹7,600", date: "Feb 11", status: "Pending" },
  { id: "INV-2044", guest: "Rajesh Kumar", room: "301", amount: "₹38,400", date: "Feb 12", status: "Pending" },
  { id: "INV-2045", guest: "David Chen", room: "112", amount: "₹4,180", date: "Feb 10", status: "Overdue" },
];

const Billing = () => (
  <HotelLayout>
    <PageHeader title="Billing & Invoicing" description="Manage payments, invoices, and financial reports" />
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Revenue" value="₹8,42,000" subtitle="This month" icon={<Receipt className="h-5 w-5" />} variant="accent" />
      <StatCard title="Paid Invoices" value={34} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
      <StatCard title="Pending" value={8} icon={<Clock className="h-5 w-5" />} variant="warning" />
      <StatCard title="Overdue" value={2} icon={<AlertCircle className="h-5 w-5" />} variant="default" />
    </div>
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
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
            <tr key={inv.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 cursor-pointer transition-colors">
              <td className="px-4 py-3 font-medium text-accent">{inv.id}</td>
              <td className="px-4 py-3 text-foreground">{inv.guest}</td>
              <td className="px-4 py-3 text-muted-foreground">{inv.room}</td>
              <td className="px-4 py-3 font-semibold text-foreground">{inv.amount}</td>
              <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  inv.status === "Paid" ? "bg-success/15 text-success" :
                  inv.status === "Pending" ? "bg-warning/15 text-warning" :
                  "bg-destructive/15 text-destructive"
                }`}>{inv.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </HotelLayout>
);

export default Billing;
