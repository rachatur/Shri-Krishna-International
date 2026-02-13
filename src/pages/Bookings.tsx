import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";
import {
  createResource,
  getResourceFromAnyDoctype,
  updateResource,
} from "@/services/erp-frappe";

type BookingRecord = {
  [key: string]: unknown;
};

type UiBooking = {
  id: string;
  guest: string;
  room: string;
  checkin: string;
  checkout: string;
  status: StatusType;
  amount: string;
  source: string;
};

type RoomUpdateRecord = {
  [key: string]: unknown;
};

const bookingSeedData = [
  {
    booking_id: "BK-1042",
    guest_name: "Rajesh Kumar",
    room_number: "301",
    room_type: "Deluxe Suite",
    check_in: "2026-02-09",
    check_out: "2026-02-12",
    status: "Occupied",
    amount: 19800,
    source: "Website",
  },
  {
    booking_id: "BK-1043",
    guest_name: "Anita Sharma",
    room_number: "205",
    room_type: "Premium King",
    check_in: "2026-02-10",
    check_out: "2026-02-13",
    status: "Reserved",
    amount: 14200,
    source: "OTA",
  },
  {
    booking_id: "BK-1044",
    guest_name: "James Wilson",
    room_number: "102",
    room_type: "Standard Twin",
    check_in: "2026-02-09",
    check_out: "2026-02-11",
    status: "Occupied",
    amount: 7600,
    source: "Direct",
  },
];

const formatDate = (value: unknown) => {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatCurrency = (value: unknown) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  return `INR ${num.toLocaleString("en-IN")}`;
};

const toStatus = (value: unknown): StatusType => {
  const status = String(value ?? "").toLowerCase();
  if (["available", "vacant", "free", "open"].includes(status)) return "available";
  if (["occupied", "checked in", "checked_in", "in house", "staying"].includes(status)) return "occupied";
  if (["reserved", "booked", "confirmed", "upcoming"].includes(status)) return "reserved";
  if (["cleaning", "housekeeping"].includes(status)) return "cleaning";
  if (["maintenance", "out of service", "repair"].includes(status)) return "maintenance";
  return "reserved";
};

const ROOM_STATUS_OVERRIDE_KEY = "roomsync_room_status_overrides";

const getRoomStatusOverrides = (): Record<string, StatusType> => {
  try {
    const raw = localStorage.getItem(ROOM_STATUS_OVERRIDE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StatusType>) : {};
  } catch {
    return {};
  }
};

const persistRoomStatusOverride = (roomNumber: string, status: StatusType) => {
  const current = getRoomStatusOverrides();
  current[roomNumber] = status;
  localStorage.setItem(ROOM_STATUS_OVERRIDE_KEY, JSON.stringify(current));
};

const mapBooking = (booking: BookingRecord): UiBooking => {
  const roomNumber = booking.room_number ?? booking.room_no ?? booking.room ?? "-";
  const roomType = booking.room_type ?? booking.room_category ?? "";
  const room = roomType ? `${String(roomNumber)} - ${String(roomType)}` : String(roomNumber);

  return {
    id: String(booking.name ?? booking.booking_id ?? booking.reservation_id ?? "N/A"),
    guest: String(booking.guest_name ?? booking.customer_name ?? booking.guest ?? "Unknown Guest"),
    room,
    checkin: formatDate(booking.check_in ?? booking.checkin ?? booking.arrival_date),
    checkout: formatDate(booking.check_out ?? booking.checkout ?? booking.departure_date),
    status: toStatus(booking.status),
    amount: formatCurrency(booking.amount ?? booking.total_amount ?? booking.grand_total),
    source: String(booking.source ?? booking.booking_source ?? booking.channel ?? "Direct"),
  };
};

const Bookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<UiBooking[]>([]);
  const [activeBookingDoctype, setActiveBookingDoctype] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("Direct");

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrSeedFromAnyDoctype<BookingRecord>([
          "Booking",
          "Reservation",
          "Hotel Reservation",
          "Room Reservation",
          "Hotel Booking",
        ], bookingSeedData);
        setBookings(result.data.map(mapBooking));
        setActiveBookingDoctype(result.doctype !== "local-seed" ? result.doctype : null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load bookings from ERP";
        setError(message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    void loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return bookings;
    return bookings.filter((b) =>
      [b.id, b.guest, b.room, b.source, b.status].join(" ").toLowerCase().includes(term)
    );
  }, [bookings, search]);

  const handleCreateBooking = async () => {
    if (!guestName.trim() || !roomNumber.trim() || !checkInDate || !checkOutDate || !amount.trim()) {
      toast({
        title: "Missing fields",
        description: "Guest name, room, dates and amount are required.",
        variant: "destructive",
      });
      return;
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid booking amount.",
        variant: "destructive",
      });
      return;
    }

    const bookingId = `BK-${Date.now().toString().slice(-6)}`;
    const bookingData = {
      booking_id: bookingId,
      guest_name: guestName.trim(),
      room_number: roomNumber.trim(),
      room_type: roomType.trim() || "Room",
      check_in: checkInDate,
      check_out: checkOutDate,
      status: "Reserved",
      amount: parsedAmount,
      source: source.trim() || "Direct",
    };

    const bookingDoctypes = [
      activeBookingDoctype,
      "Booking",
      "Reservation",
      "Hotel Reservation",
      "Room Reservation",
      "Hotel Booking",
    ].filter((value, index, arr): value is string => Boolean(value) && arr.indexOf(value) === index);

    let savedDoctype: string | null = null;
    for (const doctype of bookingDoctypes) {
      try {
        await createResource(doctype, bookingData);
        savedDoctype = doctype;
        break;
      } catch {
        continue;
      }
    }

    if (savedDoctype) {
      setActiveBookingDoctype(savedDoctype);
      toast({
        title: "Booking created",
        description: `${bookingId} saved to backend (${savedDoctype}).`,
      });
    } else {
      toast({
        title: "Backend create failed",
        description: `${bookingId} added in UI only. Verify booking doctype fields in ERP.`,
      });
    }

    try {
      const roomResult = await getResourceFromAnyDoctype<RoomUpdateRecord>(
        ["Room", "Hotel Room", "Rooms", "Room Master"],
        [
          ["room_number", "=", roomNumber.trim()],
        ],
        ["name", "status", "room_number", "room_no"]
      );
      const matchedRoom =
        roomResult.data[0] ??
        roomResult.data.find((room) => {
          const roomNo = String(room.room_number ?? room.room_no ?? "");
          return roomNo === roomNumber.trim();
        });

      if (matchedRoom?.name) {
        await updateResource(roomResult.doctype, String(matchedRoom.name), { status: "Reserved" });
      }
    } catch {
      // Room doctype/field may vary by ERP setup. We still keep UI status in sync below.
    }

    persistRoomStatusOverride(roomNumber.trim(), "reserved");
    window.dispatchEvent(new Event("roomsync:room-status-updated"));

    setBookings((prev) => [mapBooking(bookingData), ...prev]);
    setAddOpen(false);
    setGuestName("");
    setRoomNumber("");
    setRoomType("");
    setCheckInDate("");
    setCheckOutDate("");
    setAmount("");
    setSource("Direct");
  };

  return (
    <HotelLayout>
      <PageHeader
        title="Bookings"
        description="View and manage all reservations"
        actions={
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        }
      />

      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading bookings from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

      <div className="mb-4 flex gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by guest, booking ID..."
            className="bg-card pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
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
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-accent">{b.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{b.guest}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.room}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.checkin}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.checkout}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{b.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.source}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Booking</DialogTitle>
            <DialogDescription>Create a new reservation and add it to the booking list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label className="text-muted-foreground">Guest Name</Label>
              <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} className="mt-1 bg-secondary" placeholder="e.g. Anita Sharma" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground">Room Number</Label>
                <Input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="mt-1 bg-secondary" placeholder="e.g. 205" />
              </div>
              <div>
                <Label className="text-muted-foreground">Room Type</Label>
                <Input value={roomType} onChange={(e) => setRoomType(e.target.value)} className="mt-1 bg-secondary" placeholder="e.g. Deluxe Twin" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground">Check-in Date</Label>
                <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="mt-1 bg-secondary" />
              </div>
              <div>
                <Label className="text-muted-foreground">Check-out Date</Label>
                <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="mt-1 bg-secondary" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground">Amount (INR)</Label>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 bg-secondary" placeholder="e.g. 14800" />
              </div>
              <div>
                <Label className="text-muted-foreground">Source</Label>
                <Input value={source} onChange={(e) => setSource(e.target.value)} className="mt-1 bg-secondary" placeholder="Direct / OTA / Website" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCreateBooking}>
              Save Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HotelLayout>
  );
};

export default Bookings;
