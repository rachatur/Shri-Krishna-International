import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const bookings = [
  { id: "BK-1040", guest: "Vikram Singh", room: "410 - Presidential", checkin: "Feb 08", checkout: "Feb 12", status: "occupied" as StatusType, amount: "₹1,80,000", source: "Direct" },
  { id: "BK-1041", guest: "Emily Clark", room: "201 - Deluxe King", checkin: "Feb 08", checkout: "Feb 10", status: "occupied" as StatusType, amount: "₹11,600", source: "OTA" },
  { id: "BK-1042", guest: "Rajesh Kumar", room: "301 - Deluxe Suite", checkin: "Feb 09", checkout: "Feb 12", status: "occupied" as StatusType, amount: "₹36,000", source: "Direct" },
  { id: "BK-1043", guest: "Anita Sharma", room: "205 - Premium King", checkin: "Feb 10", checkout: "Feb 13", status: "reserved" as StatusType, amount: "₹21,600", source: "Agent" },
  { id: "BK-1044", guest: "James Wilson", room: "102 - Standard Twin", checkin: "Feb 09", checkout: "Feb 11", status: "occupied" as StatusType, amount: "₹6,400", source: "OTA" },
  { id: "BK-1045", guest: "Priya Patel", room: "408 - Royal Suite", checkin: "Feb 11", checkout: "Feb 15", status: "reserved" as StatusType, amount: "₹1,00,000", source: "Direct" },
  { id: "BK-1046", guest: "David Chen", room: "112 - Standard King", checkin: "Feb 09", checkout: "Feb 10", status: "occupied" as StatusType, amount: "₹3,500", source: "Walk-in" },
];

const Bookings = () => {
  return (
    <HotelLayout>
      <PageHeader
        title="Bookings"
        description="View and manage all reservations"
        actions={
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />New Booking
          </Button>
        }
      />

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by guest, booking ID..." className="pl-9 bg-card" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Booking ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guest</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Room</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Check-in</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Check-out</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-medium text-accent">{b.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{b.guest}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.room}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.checkin}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.checkout}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{b.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.source}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HotelLayout>
  );
};

export default Bookings;
