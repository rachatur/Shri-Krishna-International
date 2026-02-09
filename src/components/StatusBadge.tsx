import { cn } from "@/lib/utils";

export type StatusType = "available" | "occupied" | "maintenance" | "reserved" | "cleaning";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-success/15 text-success border-success/30" },
  occupied: { label: "Occupied", className: "bg-info/15 text-info border-info/30" },
  maintenance: { label: "Maintenance", className: "bg-destructive/15 text-destructive border-destructive/30" },
  reserved: { label: "Reserved", className: "bg-accent/15 text-accent-foreground border-accent/30" },
  cleaning: { label: "Cleaning", className: "bg-warning/15 text-warning border-warning/30" },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", config.className)}>
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", {
        "bg-success": status === "available",
        "bg-info": status === "occupied",
        "bg-destructive": status === "maintenance",
        "bg-accent": status === "reserved",
        "bg-warning": status === "cleaning",
      })} />
      {config.label}
    </span>
  );
}
