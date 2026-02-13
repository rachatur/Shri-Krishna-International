import { useEffect, useMemo, useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Plane, Car, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";

type TravelRecord = { [key: string]: unknown };
type UiTravel = { id: string; guest: string; room: string; type: string; details: string; status: string; vehicle: string };

const seedTravel = [
  { request_id: "TR-201", guest_name: "Rajesh Kumar", room_number: "301", request_type: "Airport Transfer", details: "DEL Airport to Hotel, Feb 12, 2:00 PM", status: "Confirmed", vehicle: "Sedan" },
  { request_id: "TR-202", guest_name: "Vikram Singh", room_number: "410", request_type: "City Tour", details: "Full day sightseeing, Feb 10", status: "In Progress", vehicle: "SUV" },
  { request_id: "TR-203", guest_name: "Emily Clark", room_number: "201", request_type: "Airport Drop", details: "Hotel to DEL Airport, Feb 10, 6:00 AM", status: "Pending", vehicle: "-" },
];

const TravelDesk = () => {
  const [requests, setRequests] = useState<UiTravel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTravel = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrSeedFromAnyDoctype<TravelRecord>(["Travel Request", "Hotel Travel Desk", "Travel Desk"], seedTravel);
        setRequests(
          result.data.map((r) => ({
            id: String(r.name ?? r.request_id ?? "N/A"),
            guest: String(r.guest_name ?? r.guest ?? "Unknown Guest"),
            room: String(r.room_number ?? r.room ?? "-"),
            type: String(r.request_type ?? r.type ?? "Travel"),
            details: String(r.details ?? r.description ?? "-"),
            status: String(r.status ?? "Pending"),
            vehicle: String(r.vehicle ?? r.vehicle_type ?? "-"),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load travel desk requests from ERP");
      } finally {
        setLoading(false);
      }
    };
    void loadTravel();
  }, []);

  const active = requests.filter((r) => r.status.toLowerCase() !== "completed").length;
  const vehicles = useMemo(() => new Set(requests.map((r) => r.vehicle).filter((v) => v && v !== "-")).size, [requests]);
  const tours = requests.filter((r) => r.type.toLowerCase().includes("tour")).length;

  return (
    <HotelLayout>
      <PageHeader
        title="Travel Desk"
        description="Manage guest transportation and travel bookings"
        actions={
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plane className="mr-2 h-4 w-4" />
            New Request
          </Button>
        }
      />
      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading travel requests from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard title="Active Requests" value={active} icon={<Plane className="h-5 w-5" />} variant="info" />
        <StatCard title="Vehicles Available" value={vehicles} icon={<Car className="h-5 w-5" />} variant="success" />
        <StatCard title="Tours Booked" value={tours} subtitle="From ERP data" icon={<MapPin className="h-5 w-5" />} variant="accent" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Request ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guest</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Details</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vehicle</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0">
                <td className="px-4 py-3 font-medium text-accent">{r.id}</td>
                <td className="px-4 py-3 text-foreground">{r.guest} <span className="text-muted-foreground">(Room {r.room})</span></td>
                <td className="px-4 py-3 text-foreground">{r.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.details}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.vehicle}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${r.status.toLowerCase() === "confirmed" ? "bg-success/15 text-success" : r.status.toLowerCase() === "in progress" ? "bg-info/15 text-info" : "bg-warning/15 text-warning"}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HotelLayout>
  );
};

export default TravelDesk;
