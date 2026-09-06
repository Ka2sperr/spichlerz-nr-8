import { cn } from "@/lib/utils/cn";
import type { ReservationActionState } from "@/types";

type Props = {
  state: ReservationActionState;
};

export function FormStatus({ state }: Props) {
  if (state.status === "idle" || !state.message) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        state.status === "success"
          ? "border-emerald-600/30 bg-emerald-600/10 text-emerald-800"
          : "border-red-600/30 bg-red-600/10 text-red-800",
      )}
    >
      {state.message}
    </p>
  );
}
