import { getHours } from "@/lib/content/get-hours";
import { computeOpenStatus } from "@/lib/hours/open-status";
import { OpenStatusClient } from "./open-status-client";

type Props = {
  className?: string;
};

export function OpenStatus({ className }: Props) {
  const hours = getHours();
  const initialStatus = computeOpenStatus(hours, new Date());

  return (
    <OpenStatusClient
      hours={hours}
      initialStatus={initialStatus}
      className={className}
    />
  );
}
