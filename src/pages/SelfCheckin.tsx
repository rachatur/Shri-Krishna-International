import { HotelLayout } from "@/components/HotelLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Search, CheckCircle } from "lucide-react";

const SelfCheckin = () => (
  <HotelLayout>
    <PageHeader title="Self Check-in" description="Guest self-service check-in kiosk interface" />
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
          <QrCode className="h-10 w-10 text-accent" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">Welcome to GrandStay</h2>
        <p className="mt-2 text-sm text-muted-foreground">Scan your QR code or enter your booking ID to check in</p>
        <div className="mt-6 space-y-4 text-left">
          <div>
            <Label className="text-muted-foreground">Booking ID</Label>
            <Input placeholder="e.g. BK-1043" className="mt-1 bg-secondary" />
          </div>
          <div>
            <Label className="text-muted-foreground">Last Name</Label>
            <Input placeholder="Enter your last name" className="mt-1 bg-secondary" />
          </div>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Search className="mr-2 h-4 w-4" />Find My Booking
          </Button>
        </div>
      </div>
    </div>
  </HotelLayout>
);

export default SelfCheckin;
