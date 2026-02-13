import { useEffect, useMemo, useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";

type RoomRecord = { [key: string]: unknown };
type UiRoom = { number: string; type: string; status: string };

const roomSeed = [
  { room_number: "101", room_type: "Standard", status: "Available" },
  { room_number: "202", room_type: "Deluxe", status: "Available" },
  { room_number: "410", room_type: "Presidential", status: "Available" },
];

const CounterCheckin = () => {
  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrSeedFromAnyDoctype<RoomRecord>(["Room", "Hotel Room", "Rooms", "Room Master"], roomSeed);
        setRooms(
          result.data.map((room) => ({
            number: String(room.room_number ?? room.room_no ?? room.name ?? "N/A"),
            type: String(room.room_type ?? room.type ?? room.category ?? "Room"),
            status: String(room.status ?? "Available"),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load rooms for check-in");
      } finally {
        setLoading(false);
      }
    };
    void loadRooms();
  }, []);

  const availableRooms = useMemo(
    () => rooms.filter((r) => ["available", "vacant", "open"].includes(r.status.toLowerCase())),
    [rooms]
  );
  const roomTypes = useMemo(() => Array.from(new Set(rooms.map((r) => r.type))), [rooms]);

  return (
    <HotelLayout>
      <PageHeader title="Counter Check-in" description="Process guest arrivals at the front desk" />
      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading room assignments from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Guest Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-muted-foreground">First Name</Label><Input className="mt-1 bg-secondary" /></div>
              <div><Label className="text-muted-foreground">Last Name</Label><Input className="mt-1 bg-secondary" /></div>
            </div>
            <div><Label className="text-muted-foreground">Email</Label><Input type="email" className="mt-1 bg-secondary" /></div>
            <div><Label className="text-muted-foreground">Phone</Label><Input className="mt-1 bg-secondary" /></div>
            <div>
              <Label className="text-muted-foreground">ID Type</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-secondary"><SelectValue placeholder="Select ID type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                  <SelectItem value="dl">Driving License</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-muted-foreground">ID Number</Label><Input className="mt-1 bg-secondary" /></div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Room Assignment</h2>
          <div className="space-y-4">
            <div><Label className="text-muted-foreground">Booking ID</Label><Input placeholder="BK-XXXX" className="mt-1 bg-secondary" /></div>
            <div>
              <Label className="text-muted-foreground">Room Type</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-secondary"><SelectValue placeholder="Select room type" /></SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, "-")}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Room Number</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-secondary"><SelectValue placeholder="Assign room" /></SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.number} value={room.number}>{room.number} - {room.type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-muted-foreground">Check-in Date</Label><Input type="date" className="mt-1 bg-secondary" /></div>
              <div><Label className="text-muted-foreground">Check-out Date</Label><Input type="date" className="mt-1 bg-secondary" /></div>
            </div>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Complete Check-in</Button>
          </div>
        </div>
      </div>
    </HotelLayout>
  );
};

export default CounterCheckin;
