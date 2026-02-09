import { HotelLayout } from "@/components/HotelLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { BedDouble, CalendarCheck, Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const recentBookings = [
  { id: "BK-1042", guest: "Rajesh Kumar", room: "301 - Deluxe Suite", checkin: "Feb 09", checkout: "Feb 12", status: "occupied" as StatusType },
  { id: "BK-1043", guest: "Anita Sharma", room: "205 - Premium King", checkin: "Feb 10", checkout: "Feb 13", status: "reserved" as StatusType },
  { id: "BK-1044", guest: "James Wilson", room: "102 - Standard Twin", checkin: "Feb 09", checkout: "Feb 11", status: "occupied" as StatusType },
  { id: "BK-1045", guest: "Priya Patel", room: "408 - Royal Suite", checkin: "Feb 11", checkout: "Feb 15", status: "reserved" as StatusType },
  { id: "BK-1046", guest: "David Chen", room: "112 - Standard King", checkin: "Feb 09", checkout: "Feb 10", status: "occupied" as StatusType },
];

const quickActions = [
  { label: "New Booking", icon: CalendarCheck, color: "bg-accent text-accent-foreground" },
  { label: "Walk-in Check-in", icon: Users, color: "bg-success text-success-foreground" },
  { label: "Quick Checkout", icon: Clock, color: "bg-info text-info-foreground" },
];

const Dashboard = () => {
  return (
    <HotelLayout>
      <PageHeader title="Dashboard" description="Welcome back! Here's your hotel overview for today." />

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-card transition-all hover:shadow-elevated ${action.color}`}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rooms"
          value={120}
          subtitle="12 floors"
          icon={<BedDouble className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          title="Occupancy Rate"
          value="78%"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: "5% vs yesterday", positive: true }}
          variant="success"
        />
        <StatCard
          title="Today's Check-ins"
          value={14}
          subtitle="3 pending"
          icon={<Users className="h-5 w-5" />}
          variant="info"
        />
        <StatCard
          title="Today's Revenue"
          value="₹2,84,500"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: "12% vs last week", positive: true }}
          variant="accent"
        />
      </div>

      {/* Room Status Overview + Recent Bookings */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Room Status */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-lg font-semibold text-foreground">Room Status</h2>
          <div className="mt-4 space-y-3">
            {([
              { label: "Available", count: 26, total: 120, color: "bg-success" },
              { label: "Occupied", count: 78, total: 120, color: "bg-info" },
              { label: "Reserved", count: 10, total: 120, color: "bg-accent" },
              { label: "Maintenance", count: 4, total: 120, color: "bg-destructive" },
              { label: "Cleaning", count: 2, total: 120, color: "bg-warning" },
            ]).map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all`}
                    style={{ width: `${(item.count / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
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
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium text-accent">{booking.id}</td>
                    <td className="py-3 text-foreground">{booking.guest}</td>
                    <td className="py-3 text-muted-foreground">{booking.room}</td>
                    <td className="py-3 text-muted-foreground">{booking.checkin}</td>
                    <td className="py-3"><StatusBadge status={booking.status} /></td>
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
