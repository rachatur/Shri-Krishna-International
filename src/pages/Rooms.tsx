import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const rooms = [
  { number: "101", type: "Standard King", floor: 1, status: "available" as StatusType, rate: "₹3,500", lastCleaned: "2h ago" },
  { number: "102", type: "Standard Twin", floor: 1, status: "occupied" as StatusType, rate: "₹3,200", guest: "James Wilson" },
  { number: "103", type: "Standard King", floor: 1, status: "cleaning" as StatusType, rate: "₹3,500", lastCleaned: "In progress" },
  { number: "201", type: "Deluxe King", floor: 2, status: "occupied" as StatusType, rate: "₹5,800", guest: "Sarah Lee" },
  { number: "202", type: "Deluxe Twin", floor: 2, status: "available" as StatusType, rate: "₹5,500", lastCleaned: "30m ago" },
  { number: "205", type: "Premium King", floor: 2, status: "reserved" as StatusType, rate: "₹7,200", guest: "Anita Sharma" },
  { number: "301", type: "Deluxe Suite", floor: 3, status: "occupied" as StatusType, rate: "₹12,000", guest: "Rajesh Kumar" },
  { number: "302", type: "Deluxe Suite", floor: 3, status: "maintenance" as StatusType, rate: "₹12,000" },
  { number: "408", type: "Royal Suite", floor: 4, status: "reserved" as StatusType, rate: "₹25,000", guest: "Priya Patel" },
  { number: "410", type: "Presidential Suite", floor: 4, status: "available" as StatusType, rate: "₹45,000", lastCleaned: "1h ago" },
];

const RoomCard = ({ room }: { room: typeof rooms[0] }) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-elevated cursor-pointer">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">Room {room.number}</h3>
        <p className="text-sm text-muted-foreground">{room.type}</p>
      </div>
      <StatusBadge status={room.status} />
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
      <span className="text-sm font-semibold text-accent">{room.rate}<span className="font-normal text-muted-foreground">/night</span></span>
      <span className="text-xs text-muted-foreground">Floor {room.floor}</span>
    </div>
    {room.guest && <p className="mt-2 text-xs text-muted-foreground">Guest: <span className="font-medium text-foreground">{room.guest}</span></p>}
  </div>
);

const Rooms = () => {
  return (
    <HotelLayout>
      <PageHeader
        title="Rooms"
        description="Manage all hotel rooms and their status"
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" />Filter</Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="mr-2 h-4 w-4" />Add Room</Button>
          </>
        }
      />

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All Rooms ({rooms.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({rooms.filter(r => r.status === "available").length})</TabsTrigger>
          <TabsTrigger value="occupied">Occupied ({rooms.filter(r => r.status === "occupied").length})</TabsTrigger>
          <TabsTrigger value="reserved">Reserved ({rooms.filter(r => r.status === "reserved").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rooms.map((room) => <RoomCard key={room.number} room={room} />)}
          </div>
        </TabsContent>
        <TabsContent value="available">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rooms.filter(r => r.status === "available").map((room) => <RoomCard key={room.number} room={room} />)}
          </div>
        </TabsContent>
        <TabsContent value="occupied">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rooms.filter(r => r.status === "occupied").map((room) => <RoomCard key={room.number} room={room} />)}
          </div>
        </TabsContent>
        <TabsContent value="reserved">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rooms.filter(r => r.status === "reserved").map((room) => <RoomCard key={room.number} room={room} />)}
          </div>
        </TabsContent>
      </Tabs>
    </HotelLayout>
  );
};

export default Rooms;
