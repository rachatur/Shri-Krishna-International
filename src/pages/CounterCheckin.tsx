import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CounterCheckin = () => (
  <HotelLayout>
    <PageHeader title="Counter Check-in" description="Process guest arrivals at the front desk" />
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Guest Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-muted-foreground">First Name</Label><Input className="mt-1 bg-secondary" /></div>
            <div><Label className="text-muted-foreground">Last Name</Label><Input className="mt-1 bg-secondary" /></div>
          </div>
          <div><Label className="text-muted-foreground">Email</Label><Input type="email" className="mt-1 bg-secondary" /></div>
          <div><Label className="text-muted-foreground">Phone</Label><Input className="mt-1 bg-secondary" /></div>
          <div><Label className="text-muted-foreground">ID Type</Label>
            <Select><SelectTrigger className="mt-1 bg-secondary"><SelectValue placeholder="Select ID type" /></SelectTrigger>
              <SelectContent><SelectItem value="passport">Passport</SelectItem><SelectItem value="aadhaar">Aadhaar Card</SelectItem><SelectItem value="dl">Driving License</SelectItem></SelectContent>
            </Select>
          </div>
          <div><Label className="text-muted-foreground">ID Number</Label><Input className="mt-1 bg-secondary" /></div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Room Assignment</h2>
        <div className="space-y-4">
          <div><Label className="text-muted-foreground">Booking ID</Label><Input placeholder="BK-XXXX" className="mt-1 bg-secondary" /></div>
          <div><Label className="text-muted-foreground">Room Type</Label>
            <Select><SelectTrigger className="mt-1 bg-secondary"><SelectValue placeholder="Select room type" /></SelectTrigger>
              <SelectContent><SelectItem value="standard">Standard</SelectItem><SelectItem value="deluxe">Deluxe</SelectItem><SelectItem value="suite">Suite</SelectItem><SelectItem value="presidential">Presidential</SelectItem></SelectContent>
            </Select>
          </div>
          <div><Label className="text-muted-foreground">Room Number</Label>
            <Select><SelectTrigger className="mt-1 bg-secondary"><SelectValue placeholder="Assign room" /></SelectTrigger>
              <SelectContent><SelectItem value="101">101 - Standard King</SelectItem><SelectItem value="202">202 - Deluxe Twin</SelectItem><SelectItem value="410">410 - Presidential</SelectItem></SelectContent>
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

export default CounterCheckin;
