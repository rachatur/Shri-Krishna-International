import { useEffect, useMemo, useState } from "react";
import { HotelLayout } from "@/components/HotelLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { BedDouble, CalendarCheck, Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getOrSeedFromAnyDoctype } from "@/services/erp-hotel";
import { BackendSetupReport, checkHotelBackendSetup } from "@/services/erp-frappe";
import { useNavigate } from "react-router-dom";

type GenericRecord = { [key: string]: unknown };
type UiBooking = { id: string; guest: string; room: string; checkin: string; status: StatusType };

const roomSeedData = [
  { room_number: "101", room_type: "Standard King", floor: 1, status: "Available", rate: 4200 },
  { room_number: "202", room_type: "Deluxe Twin", floor: 2, status: "Occupied", rate: 6200 },
  { room_number: "301", room_type: "Deluxe Suite", floor: 3, status: "Reserved", rate: 9800 },
  { room_number: "410", room_type: "Presidential Suite", floor: 4, status: "Occupied", rate: 24500 },
];

const bookingSeedData = [
  { booking_id: "BK-1042", guest_name: "Rajesh Kumar", room_number: "301", room_type: "Deluxe Suite", check_in: "2026-02-09", status: "Occupied" },
  { booking_id: "BK-1043", guest_name: "Anita Sharma", room_number: "205", room_type: "Premium King", check_in: "2026-02-10", status: "Reserved" },
  { booking_id: "BK-1044", guest_name: "James Wilson", room_number: "102", room_type: "Standard Twin", check_in: "2026-02-09", status: "Occupied" },
];

const invoiceSeedData = [
  { invoice_number: "INV-2041", guest_name: "Vikram Singh", room_number: "410", amount: 184200, date: "2026-02-12", status: "Paid" },
  { invoice_number: "INV-2042", guest_name: "Emily Clark", room_number: "201", amount: 12800, date: "2026-02-10", status: "Paid" },
  { invoice_number: "INV-2043", guest_name: "James Wilson", room_number: "102", amount: 7600, date: "2026-02-11", status: "Pending" },
];

const toStatus = (value: unknown): StatusType => {
  const status = String(value ?? "").toLowerCase();
  if (["available", "vacant", "free", "open"].includes(status)) return "available";
  if (["occupied", "checked in", "checked_in", "in house", "staying"].includes(status)) return "occupied";
  if (["reserved", "booked", "confirmed", "upcoming"].includes(status)) return "reserved";
  if (["cleaning", "housekeeping"].includes(status)) return "cleaning";
  if (["maintenance", "out of service", "repair"].includes(status)) return "maintenance";
  return "reserved";
};

const formatDate = (value: unknown) => {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const formatCurrency = (value: number) => `INR ${value.toLocaleString("en-IN")}`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<GenericRecord[]>([]);
  const [bookings, setBookings] = useState<UiBooking[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [setupReport, setSetupReport] = useState<BackendSetupReport | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [setupResult, roomResult, bookingResult, invoiceResult] = await Promise.all([
          checkHotelBackendSetup(),
          getOrSeedFromAnyDoctype<GenericRecord>(["Room", "Hotel Room", "Rooms", "Room Master"], roomSeedData),
          getOrSeedFromAnyDoctype<GenericRecord>(
            ["Booking", "Reservation", "Hotel Reservation", "Room Reservation", "Hotel Booking"],
            bookingSeedData
          ),
          getOrSeedFromAnyDoctype<GenericRecord>(["Sales Invoice", "Invoice", "Hotel Invoice", "Billing"], invoiceSeedData),
        ]);

        setSetupReport(setupResult);
        setRooms(roomResult.data);
        setBookings(
          bookingResult.data.slice(0, 5).map((b) => {
            const roomNo = b.room_number ?? b.room_no ?? b.room ?? "-";
            const roomType = b.room_type ?? b.room_category ?? "";
            return {
              id: String(b.name ?? b.booking_id ?? b.reservation_id ?? "N/A"),
              guest: String(b.guest_name ?? b.customer_name ?? b.guest ?? "Unknown Guest"),
              room: roomType ? `${String(roomNo)} - ${String(roomType)}` : String(roomNo),
              checkin: formatDate(b.check_in ?? b.checkin ?? b.arrival_date),
              status: toStatus(b.status),
            };
          })
        );
        setRevenue(
          invoiceResult.data.reduce((sum, inv) => {
            const value = Number(inv.amount ?? inv.total_amount ?? inv.grand_total ?? 0);
            return sum + (Number.isNaN(value) ? 0 : value);
          }, 0)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data from ERP");
      } finally {
        setLoading(false);
      }
    };
    void loadDashboard();
  }, []);

  const totalRooms = rooms.length;
  const occupiedCount = useMemo(() => rooms.filter((r) => toStatus(r.status) === "occupied").length, [rooms]);
  const reservedCount = useMemo(() => rooms.filter((r) => toStatus(r.status) === "reserved").length, [rooms]);
  const availableCount = useMemo(() => rooms.filter((r) => toStatus(r.status) === "available").length, [rooms]);
  const maintenanceCount = useMemo(() => rooms.filter((r) => toStatus(r.status) === "maintenance").length, [rooms]);
  const cleaningCount = useMemo(() => rooms.filter((r) => toStatus(r.status) === "cleaning").length, [rooms]);
  const occupancy = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

  return (
    <HotelLayout>
      <PageHeader title="Dashboard" description="Welcome back! Here's your hotel overview for today." />
      {setupReport && (!setupReport.ok || setupReport.issues.length > 0) ? (
        <div className="mb-4 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
          <p className="font-medium">Backend setup needs attention</p>
          {setupReport.issues.length > 0 ? <p className="mt-1">{setupReport.issues[0]}</p> : null}
          {setupReport.warnings.length > 0 ? <p className="mt-1">{setupReport.warnings[0]}</p> : null}
        </div>
      ) : null}
      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading dashboard from ERP...</p> : null}
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: "New Booking", icon: CalendarCheck, color: "bg-accent text-accent-foreground", path: "/bookings" },
          { label: "Walk-in Check-in", icon: Users, color: "bg-success text-success-foreground", path: "/counter-checkin" },
          { label: "Quick Checkout", icon: Clock, color: "bg-info text-info-foreground", path: "/counter-checkout" },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-card transition-all hover:shadow-elevated ${action.color}`}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Rooms" value={totalRooms} subtitle="Live from ERP" icon={<BedDouble className="h-5 w-5" />} variant="default" />
        <StatCard title="Occupancy Rate" value={`${occupancy}%`} icon={<TrendingUp className="h-5 w-5" />} variant="success" />
        <StatCard title="Today's Check-ins" value={bookings.length} subtitle={`${reservedCount} reserved`} icon={<Users className="h-5 w-5" />} variant="info" />
        <StatCard title="Today's Revenue" value={formatCurrency(revenue)} icon={<DollarSign className="h-5 w-5" />} variant="accent" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-lg font-semibold text-foreground">Room Status</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Available", count: availableCount, color: "bg-success" },
              { label: "Occupied", count: occupiedCount, color: "bg-info" },
              { label: "Reserved", count: reservedCount, color: "bg-accent" },
              { label: "Maintenance", count: maintenanceCount, color: "bg-destructive" },
              { label: "Cleaning", count: cleaningCount, color: "bg-warning" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className={`h-2 rounded-full ${item.color} transition-all`} style={{ width: `${totalRooms > 0 ? (item.count / totalRooms) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent Bookings</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Booking ID</th>
                  <th className="pb-3 font-medium text-muted-foreground">Guest</th>
                  <th className="pb-3 font-medium text-muted-foreground">Room</th>
                  <th className="pb-3 font-medium text-muted-foreground">Check-in</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium text-accent">{booking.id}</td>
                    <td className="py-3 text-foreground">{booking.guest}</td>
                    <td className="py-3 text-muted-foreground">{booking.room}</td>
                    <td className="py-3 text-muted-foreground">{booking.checkin}</td>
                    <td className="py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HotelLayout>
  );
};

export default Dashboard;
