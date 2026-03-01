import type { Client } from "../types";

type Props = {
  client: Client;
  subtitle?: string;
};

export function ClientCard({ client, subtitle = "Active client" }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-zinc-900">{client.name}</div>
          <div className="text-sm text-zinc-500">{subtitle}</div>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Demo
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Compliance" value="—" />
        <Stat label="Last log" value="Recent" />
        <Stat label="Plan" value="Lower" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}