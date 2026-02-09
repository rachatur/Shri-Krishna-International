import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Plane, Car, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";

const travelRequests = [
  { id: "TR-201", guest: "Rajesh Kumar", room: "301", type: "Airport Transfer", details: "DEL Airport → Hotel, Feb 12, 2:00 PM", status: "Confirmed", vehicle: "Sedan" },
  { id: "TR-202", guest: "Vikram Singh", room: "410", type: "City Tour", details: "Full day sightseeing, Feb 10", status: "In Progress", vehicle: "SUV" },
  { id: "TR-203", guest: "Emily Clark", room: "201", type: "Airport Drop", details: "Hotel → DEL Airport, Feb 10, 6:00 AM", status: "Pending", vehicle: "—" },
  { id: "TR-204", guest: "James Wilson", room: "102", type: "Railway Transfer", details: "NDLS Station → Hotel, Feb 11, 10:00 AM", status: "Confirmed", vehicle: "Sedan" },
];

const TravelDesk = () => (
  <HotelLayout>
    <PageHeader title="Travel Desk" description="Manage guest transportation and travel bookings" actions={<Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"><Plane className="mr-2 h-4 w-4" />New Request</Button>} />
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      <StatCard title="Active Requests" value={6} icon={<Plane className="h-5 w-5" />} variant="info" />
      <StatCard title="Vehicles Available" value={4} icon={<Car className="h-5 w-5" />} variant="success" />
      <StatCard title="Tours Booked" value={3} subtitle="This week" icon={<MapPin className="h-5 w-5" />} variant="accent" />
    </div>
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border bg-secondary/50">
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Request ID</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guest</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Details</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vehicle</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
        </tr></thead>
        <tbody>
          {travelRequests.map((r) => (
            <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-accent">{r.id}</td>
              <td className="px-4 py-3 text-foreground">{r.guest} <span className="text-muted-foreground">(Room {r.room})</span></td>
              <td className="px-4 py-3 text-foreground">{r.type}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.details}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.vehicle}</td>
              <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                r.status === "Confirmed" ? "bg-success/15 text-success" :
                r.status === "In Progress" ? "bg-info/15 text-info" :
                "bg-warning/15 text-warning"
              }`}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </HotelLayout>
);

export default TravelDesk;
