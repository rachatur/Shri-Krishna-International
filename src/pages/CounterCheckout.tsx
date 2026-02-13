import { useEffect, useMemo, useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CreditCard, Printer } from "lucide-react";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";

type AnyRecord = { [key: string]: unknown };
type UiCheckout = { id: string; room: string; guest: string; checkin: string; checkout: string; balance: number; extras: number };

const bookingSeed = [
  { booking_id: "BK-1044", room_number: "102", guest_name: "James Wilson", check_in: "2026-02-09", check_out: "2026-02-11", status: "Occupied", amount: 6400, extras: 1200 },
  { booking_id: "BK-1046", room_number: "112", guest_name: "David Chen", check_in: "2026-02-09", check_out: "2026-02-10", status: "Occupied", amount: 3500, extras: 680 },
];

const formatCurrency = (value: number) => `INR ${value.toLocaleString("en-IN")}`;
const formatDate = (value: unknown) => {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const CounterCheckout = () => {
  const [guests, setGuests] = useState<UiCheckout[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCheckout = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrSeedFromAnyDoctype<AnyRecord>(
          ["Booking", "Reservation", "Hotel Reservation", "Room Reservation", "Hotel Booking"],
          bookingSeed
        );
        setGuests(
          result.data
            .filter((b) => String(b.status ?? "").toLowerCase() === "occupied")
            .map((b) => ({
              id: String(b.name ?? b.booking_id ?? "N/A"),
              room: String(b.room_number ?? b.room_no ?? b.room ?? "-"),
              guest: String(b.guest_name ?? b.customer_name ?? b.guest ?? "Unknown Guest"),
              checkin: formatDate(b.check_in ?? b.checkin ?? b.arrival_date),
              checkout: formatDate(b.check_out ?? b.checkout ?? b.departure_date),
              balance: Number(b.amount ?? b.total_amount ?? b.grand_total ?? 0),
              extras: Number(b.extras ?? b.extra_charges ?? 0),
            }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load checkout data from ERP");
      } finally {
        setLoading(false);
      }
    };
    void loadCheckout();
  }, []);

  const filteredGuests = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return guests;
    return guests.filter((g) => `${g.room} ${g.guest} ${g.id}`.toLowerCase().includes(term));
  }, [guests, search]);

  return (
    <HotelLayout>
      <PageHeader title="Counter Check-out" description="Process guest departures and settle bills" />
      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading checkout guests from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      <div className="mb-6 max-w-sm">
        <Label className="text-muted-foreground">Search Guest / Room</Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Room number or guest name" className="bg-card pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="space-y-4">
        {filteredGuests.map((g) => (
          <div key={g.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Room {g.room} - {g.guest}</h3>
                <p className="text-sm text-muted-foreground">{g.checkin} to {g.checkout}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Room Charges</p>
                  <p className="font-semibold text-foreground">{formatCurrency(g.balance)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Extras</p>
                  <p className="font-semibold text-accent">{formatCurrency(g.extras)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="mr-1 h-4 w-4" />
                    Invoice
                  </Button>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <CreditCard className="mr-1 h-4 w-4" />
                    Settle & Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </HotelLayout>
  );
};

export default CounterCheckout;
