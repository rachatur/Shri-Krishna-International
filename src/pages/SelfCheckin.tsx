import { useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Search, CheckCircle } from "lucide-react";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";

type BookingRecord = { [key: string]: unknown };

const bookingSeed = [
  { booking_id: "BK-1043", guest_name: "Anita Sharma", last_name: "Sharma", room_number: "205", room_type: "Premium King", check_in: "2026-02-10", check_out: "2026-02-13", status: "Reserved" },
];

const SelfCheckin = () => {
  const [bookingId, setBookingId] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ guest: string; room: string; checkin: string; checkout: string } | null>(null);

  const findBooking = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await getOrSeedFromAnyDoctype<BookingRecord>(
        ["Booking", "Reservation", "Hotel Reservation", "Room Reservation", "Hotel Booking"],
        bookingSeed
      );
      const match = data.data.find((b) => {
        const id = String(b.name ?? b.booking_id ?? b.reservation_id ?? "").toLowerCase();
        const guest = String(b.guest_name ?? b.customer_name ?? b.guest ?? "").toLowerCase();
        const guestLastName = guest.split(" ").at(-1) ?? "";
        return id === bookingId.trim().toLowerCase() && guestLastName === lastName.trim().toLowerCase();
      });
      if (!match) {
        setError("No matching booking found. Please verify Booking ID and Last Name.");
        return;
      }
      const checkInRaw = String(match.check_in ?? match.checkin ?? match.arrival_date ?? "");
      const checkOutRaw = String(match.check_out ?? match.checkout ?? match.departure_date ?? "");
      const checkinDate = new Date(checkInRaw);
      const checkoutDate = new Date(checkOutRaw);
      setResult({
        guest: String(match.guest_name ?? match.customer_name ?? match.guest ?? "Guest"),
        room: `${String(match.room_number ?? match.room ?? "-")} - ${String(match.room_type ?? match.room_category ?? "Room")}`,
        checkin: Number.isNaN(checkinDate.getTime()) ? checkInRaw : checkinDate.toLocaleDateString("en-IN"),
        checkout: Number.isNaN(checkoutDate.getTime()) ? checkOutRaw : checkoutDate.toLocaleDateString("en-IN"),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search booking in ERP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HotelLayout>
      <PageHeader title="Self Check-in" description="Guest self-service check-in kiosk interface" />
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-elevated">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
            <QrCode className="h-10 w-10 text-accent" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">Welcome to GrandStay</h2>
          <p className="mt-2 text-sm text-muted-foreground">Scan your QR code or enter your booking ID to check in</p>
          <div className="mt-6 space-y-4 text-left">
            <div>
              <Label className="text-muted-foreground">Booking ID</Label>
              <Input placeholder="e.g. BK-1043" className="mt-1 bg-secondary" value={bookingId} onChange={(e) => setBookingId(e.target.value)} />
            </div>
            <div>
              <Label className="text-muted-foreground">Last Name</Label>
              <Input placeholder="Enter your last name" className="mt-1 bg-secondary" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={findBooking} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Searching..." : "Find My Booking"}
            </Button>
          </div>
          {error ? <p className="mt-4 text-left text-sm text-destructive">{error}</p> : null}
          {result ? (
            <div className="mt-4 rounded-xl border border-success/30 bg-success/10 p-4 text-left">
              <p className="flex items-center gap-2 text-sm font-medium text-success">
                <CheckCircle className="h-4 w-4" />
                Booking Found
              </p>
              <p className="mt-2 text-sm text-foreground"><span className="text-muted-foreground">Guest:</span> {result.guest}</p>
              <p className="text-sm text-foreground"><span className="text-muted-foreground">Room:</span> {result.room}</p>
              <p className="text-sm text-foreground"><span className="text-muted-foreground">Check-in:</span> {result.checkin}</p>
              <p className="text-sm text-foreground"><span className="text-muted-foreground">Check-out:</span> {result.checkout}</p>
            </div>
          ) : null}
        </div>
      </div>
    </HotelLayout>
  );
};

export default SelfCheckin;
