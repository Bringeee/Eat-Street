import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DistanceDisplay() {
  const { state, distanceKm, withinRange, error } = useGeolocation();

  if (state === "idle") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-primary/40 hover:bg-primary/10"
        onClick={() => window.location.reload()}
      >
        <MapPin className="h-4 w-4" />
        Check Distance
      </Button>
    );
  }

  if (state === "loading") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/40">
        <Loader className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Detecting location...</span>
      </div>
    );
  }

  if (state === "denied" || state === "unavailable" || error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/40">
        <MapPin className="h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">{error?.substring(0, 40)}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
        withinRange
          ? "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-700"
          : "bg-orange-50 border-orange-300 dark:bg-orange-950 dark:border-orange-700",
      )}
    >
      <MapPin
        className={cn("h-4 w-4", withinRange ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400")}
      />
      <span className={cn("text-sm font-medium", withinRange ? "text-green-700 dark:text-green-300" : "text-orange-700 dark:text-orange-300")}>
        {distanceKm} km away {withinRange ? "✓" : ""}
      </span>
    </div>
  );
}
