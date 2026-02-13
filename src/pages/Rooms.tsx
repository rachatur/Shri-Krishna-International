import { useEffect, useMemo, useState } from "react";
import { Plus, Filter } from "lucide-react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";
import { createResource } from "@/services/erp-frappe";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

type RoomRecord = {
  [key: string]: unknown;
};

type UiRoom = {
  number: string;
  type: string;
  floor: string | number;
  status: StatusType;
  rate: string;
  guest?: string;
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

const roomSeedData = [
  { room_number: "101", room_type: "Standard King", floor: 1, status: "Available", rate: 4200 },
  { room_number: "202", room_type: "Deluxe Twin", floor: 2, status: "Occupied", rate: 6200, guest_name: "James Wilson" },
  { room_number: "301", room_type: "Deluxe Suite", floor: 3, status: "Reserved", rate: 9800, guest_name: "Rajesh Kumar" },
  { room_number: "410", room_type: "Presidential Suite", floor: 4, status: "Occupied", rate: 24500, guest_name: "Vikram Singh" },
];

const formatCurrency = (value: unknown) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  return `INR ${num.toLocaleString("en-IN")}`;
};

const toStatus = (value: unknown): StatusType => {
  const status = String(value ?? "").toLowerCase();
  if (["available", "vacant", "free", "open"].includes(status)) return "available";
  if (["occupied", "checked in", "checked_in", "in use", "staying"].includes(status)) return "occupied";
  if (["reserved", "booked", "upcoming"].includes(status)) return "reserved";
  if (["cleaning", "housekeeping"].includes(status)) return "cleaning";
  if (["maintenance", "out of service", "repair"].includes(status)) return "maintenance";
  return "available";
};

const mapRoom = (room: RoomRecord): UiRoom => {
  const number = String(room.room_number ?? room.room_no ?? room.name ?? "N/A");
  const type = String(room.room_type ?? room.type ?? room.category ?? "Room");
  const floor = String(room.floor ?? room.floor_no ?? "-");
  const rate = formatCurrency(room.rate ?? room.price ?? room.standard_rate ?? room.room_rate);
  const guest = room.guest_name ?? room.guest ?? room.current_guest;

  return {
    number,
    type,
    floor,
    status: toStatus(room.status),
    rate,
    guest: guest ? String(guest) : undefined,
  };
};

const RoomCard = ({ room }: { room: UiRoom }) => (
  <div className="cursor-pointer rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-elevated">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">Room {room.number}</h3>
        <p className="text-sm text-muted-foreground">{room.type}</p>
      </div>
      <StatusBadge status={room.status} />
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
      <span className="text-sm font-semibold text-accent">
        {room.rate}
        <span className="font-normal text-muted-foreground">/night</span>
      </span>
      <span className="text-xs text-muted-foreground">Floor {room.floor}</span>
    </div>
    {room.guest ? (
      <p className="mt-2 text-xs text-muted-foreground">
        Guest: <span className="font-medium text-foreground">{room.guest}</span>
      </p>
    ) : null}
  </div>
);

const Rooms = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [activeRoomDoctype, setActiveRoomDoctype] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | StatusType>("all");
  const [filterType, setFilterType] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomType, setNewRoomType] = useState("Standard King");
  const [newRoomFloor, setNewRoomFloor] = useState("");
  const [newRoomRate, setNewRoomRate] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrSeedFromAnyDoctype<RoomRecord>([
          "Room",
          "Hotel Room",
          "Rooms",
          "Room Master",
        ], roomSeedData);
        const overrides = getRoomStatusOverrides();
        const mapped = result.data.map(mapRoom).map((room) => ({
          ...room,
          status: overrides[room.number] ?? room.status,
        }));
        setRooms(mapped);
        setActiveRoomDoctype(result.doctype !== "local-seed" ? result.doctype : null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load rooms from ERP";
        setError(message);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    void loadRooms();

    const handleRoomStatusEvent = () => {
      void loadRooms();
    };
    window.addEventListener("roomsync:room-status-updated", handleRoomStatusEvent);
    return () => {
      window.removeEventListener("roomsync:room-status-updated", handleRoomStatusEvent);
    };
  }, []);

  const roomTypes = useMemo(() => Array.from(new Set(rooms.map((room) => room.type))), [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const statusMatch = filterStatus === "all" || room.status === filterStatus;
      const typeMatch = filterType === "all" || room.type === filterType;
      return statusMatch && typeMatch;
    });
  }, [filterStatus, filterType, rooms]);

  const availableRooms = useMemo(() => filteredRooms.filter((r) => r.status === "available"), [filteredRooms]);
  const occupiedRooms = useMemo(() => filteredRooms.filter((r) => r.status === "occupied"), [filteredRooms]);
  const reservedRooms = useMemo(() => filteredRooms.filter((r) => r.status === "reserved"), [filteredRooms]);

  const addRoom = async () => {
    if (!newRoomNumber.trim() || !newRoomFloor.trim() || !newRoomRate.trim()) {
      toast({
        title: "Missing fields",
        description: "Room number, floor and rate are required.",
        variant: "destructive",
      });
      return;
    }

    const parsedRate = Number(newRoomRate);
    if (Number.isNaN(parsedRate) || parsedRate <= 0) {
      toast({
        title: "Invalid rate",
        description: "Please enter a valid room rate.",
        variant: "destructive",
      });
      return;
    }

    const roomData = {
      room_number: newRoomNumber.trim(),
      room_type: newRoomType,
      floor: newRoomFloor.trim(),
      status: "Available",
      rate: parsedRate,
    };

    const roomDoctypes = [
      activeRoomDoctype,
      "Room",
      "Hotel Room",
      "Rooms",
      "Room Master",
    ].filter((value, index, arr): value is string => Boolean(value) && arr.indexOf(value) === index);

    let savedDoctype: string | null = null;
    try {
      for (const doctype of roomDoctypes) {
        try {
          await createResource(doctype, roomData);
          savedDoctype = doctype;
          break;
        } catch {
          continue;
        }
      }

      if (!savedDoctype) {
        throw new Error("Room create failed in all configured doctypes");
      }

      setActiveRoomDoctype(savedDoctype);
      toast({
        title: "Room created",
        description: `Room ${newRoomNumber.trim()} was added to backend (${savedDoctype}).`,
      });
    } catch {
      toast({
        title: "Backend create failed",
        description: `Room ${newRoomNumber.trim()} added in UI only. Verify Room doctype fields in ERP.`,
      });
    }

    setRooms((prev) => [
      ...prev,
      mapRoom(roomData),
    ]);
    setAddOpen(false);
    setNewRoomNumber("");
    setNewRoomFloor("");
    setNewRoomRate("");
  };

  return (
    <HotelLayout>
      <PageHeader
        title="Rooms"
        description="Manage all hotel rooms and their status"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowFilters((prev) => !prev)}>
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Filter"}
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </>
        }
      />

      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading rooms from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

      {showFilters ? (
        <div className="mb-4 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-card sm:grid-cols-2">
          <div>
            <Label className="text-muted-foreground">Filter by status</Label>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as "all" | StatusType)}>
              <SelectTrigger className="mt-1 bg-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-muted-foreground">Filter by room type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="mt-1 bg-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All Rooms ({filteredRooms.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableRooms.length})</TabsTrigger>
          <TabsTrigger value="occupied">Occupied ({occupiedRooms.length})</TabsTrigger>
          <TabsTrigger value="reserved">Reserved ({reservedRooms.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room.number} room={room} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="available">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {availableRooms.map((room) => (
              <RoomCard key={room.number} room={room} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="occupied">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {occupiedRooms.map((room) => (
              <RoomCard key={room.number} room={room} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reserved">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reservedRooms.map((room) => (
              <RoomCard key={room.number} room={room} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>Create a new room and add it to the room list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label className="text-muted-foreground">Room Number</Label>
              <Input value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} className="mt-1 bg-secondary" placeholder="e.g. 512" />
            </div>
            <div>
              <Label className="text-muted-foreground">Room Type</Label>
              <Select value={newRoomType} onValueChange={setNewRoomType}>
                <SelectTrigger className="mt-1 bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard King">Standard King</SelectItem>
                  <SelectItem value="Standard Twin">Standard Twin</SelectItem>
                  <SelectItem value="Deluxe Twin">Deluxe Twin</SelectItem>
                  <SelectItem value="Deluxe Suite">Deluxe Suite</SelectItem>
                  <SelectItem value="Presidential Suite">Presidential Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground">Floor</Label>
                <Input value={newRoomFloor} onChange={(e) => setNewRoomFloor(e.target.value)} className="mt-1 bg-secondary" placeholder="e.g. 5" />
              </div>
              <div>
                <Label className="text-muted-foreground">Rate (INR)</Label>
                <Input value={newRoomRate} onChange={(e) => setNewRoomRate(e.target.value)} className="mt-1 bg-secondary" placeholder="e.g. 8500" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={addRoom}>Add Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HotelLayout>
  );
};

export default Rooms;
