import type { Client, Workout, WorkoutLog } from "../types";

export function ClientHome({
  client,
  workouts,
  logs,
  onOpenWorkout,
}: {
  client: Client;
  workouts: Workout[];
  logs: WorkoutLog[];
  onOpenWorkout: (workoutId: string) => void;
}) {
  function lastDone(workoutId: string): string | null {
    const relevant = logs
      .filter((l) => l.workoutId === workoutId)
      .slice()
      .sort((a, b) => b.dateISO.localeCompare(a.dateISO));
    return relevant[0]?.dateISO ?? null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-xs text-zinc-500">Client</div>
        <div className="mt-1 text-base font-semibold text-zinc-900">{client.name}</div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold text-zinc-900">Your workouts</div>

        <div className="mt-3 space-y-2">
          {workouts.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => onOpenWorkout(w.id)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left hover:bg-zinc-50"
            >
              <div className="text-sm font-semibold text-zinc-900">{w.name}</div>
              <div className="text-xs text-zinc-500">
                Items: {w.items.length} • Last completed: {lastDone(w.id) ?? "—"}
              </div>
            </button>
          ))}

          {workouts.length === 0 ? (
            <div className="text-sm text-zinc-500">No workouts assigned yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}