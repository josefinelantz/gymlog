import { useMemo, useState } from "react";
import type { Client } from "../types";

export function PTHome({
  clients,
  onNewClient,
  onGoClient,
  onGoExerciseLibrary,
}: {
  clients: Client[];
  onNewClient: () => void;
  onGoClient: (clientId: string) => void;
  onGoExerciseLibrary: () => void;
}) {
  const [q, setQ] = useState("");

  const matches = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(qq));
  }, [clients, q]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-xs text-zinc-500">PT start</div>
        <div className="mt-1 text-base font-semibold text-zinc-900">
          Choose an action
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onNewClient}
            className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            + New client
          </button>

          <button
            type="button"
            onClick={onGoExerciseLibrary}
            className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
          >
            Exercise library
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold text-zinc-900">Go to client</div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name…"
          className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
        />

        <div className="mt-3 space-y-2">
          {matches.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onGoClient(c.id)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left hover:bg-zinc-50"
            >
              <div className="text-sm font-semibold text-zinc-900">{c.name}</div>
              <div className="text-xs text-zinc-500">Open</div>
            </button>
          ))}

          {matches.length === 0 ? (
            <div className="text-sm text-zinc-500">No matches.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}