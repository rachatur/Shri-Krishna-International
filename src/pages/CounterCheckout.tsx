import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CreditCard, Printer } from "lucide-react";

const checkoutGuests = [
  { room: "102", guest: "James Wilson", checkin: "Feb 09", checkout: "Feb 11", balance: "₹6,400", extras: "₹1,200" },
  { room: "112", guest: "David Chen", checkin: "Feb 09", checkout: "Feb 10", balance: "₹3,500", extras: "₹680" },
];

const CounterCheckout = () => (
  <HotelLayout>
    <PageHeader title="Counter Check-out" description="Process guest departures and settle bills" />
    <div className="mb-6 max-w-sm">
      <Label className="text-muted-foreground">Search Guest / Room</Label>
      <div className="relative mt-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Room number or guest name" className="pl-9 bg-card" />
      </div>
    </div>
    <div className="space-y-4">
      {checkoutGuests.map((g) => (
        <div key={g.room} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Room {g.room} — {g.guest}</h3>
              <p className="text-sm text-muted-foreground">{g.checkin} → {g.checkout}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Room Charges</p>
                <p className="font-semibold text-foreground">{g.balance}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Extras</p>
                <p className="font-semibold text-accent">{g.extras}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Printer className="mr-1 h-4 w-4" />Invoice</Button>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"><CreditCard className="mr-1 h-4 w-4" />Settle & Checkout</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </HotelLayout>
);

export default CounterCheckout;
