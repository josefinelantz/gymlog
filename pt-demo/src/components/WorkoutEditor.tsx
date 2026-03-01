import type { Exercise, Workout, WorkoutExercise } from "../types";

type Props = {
  workout: Workout;
  exercises: Exercise[];
  onUpdateWorkout: (workout: Workout) => void;
};

export function WorkoutEditor({ workout, exercises, onUpdateWorkout }: Props) {
  const exerciseById = new Map(exercises.map((e) => [e.id, e]));

  function updateItem(itemId: string, patch: Partial<WorkoutExercise>) {
    const next: Workout = {
      ...workout,
      items: workout.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
    };
    onUpdateWorkout(next);
  }

  function removeItem(itemId: string) {
    const next: Workout = { ...workout, items: workout.items.filter((it) => it.id !== itemId) };
    onUpdateWorkout(next);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-900">Workout</h2>
        <span className="text-xs text-zinc-500">{workout.name}</span>
      </div>

      <div className="mt-3 space-y-2">
        {workout.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-zinc-500">
            Add an exercise from the library.
          </div>
        ) : null}

        {workout.items.map((it) => {
          const ex = exerciseById.get(it.exerciseId);
          return (
            <div
              key={it.id}
              className="rounded-xl border border-zinc-200 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900">
                    {ex?.name ?? "Unknown exercise"}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">Targets for today</div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-200"
                >
                  Remove
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <MiniNumber
                  label="Sets"
                  value={it.setsTarget}
                  onChange={(v) => updateItem(it.id, { setsTarget: v })}
                />
                <MiniNumber
                  label="Reps"
                  value={it.repsTarget}
                  onChange={(v) => updateItem(it.id, { repsTarget: v })}
                />
                <div className="hidden sm:block rounded-xl bg-zinc-50 p-3">
                  <div className="text-xs text-zinc-500">Notes</div>
                  <div className="mt-1 text-xs font-medium text-zinc-900 line-clamp-2">
                    {ex?.notes ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-zinc-500">
        Demo: workout edits are instant (no save step).
      </div>
    </div>
  );
}

function MiniNumber({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="rounded-xl bg-zinc-50 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <input
        type="number"
        value={value}
        min={1}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value || 1)))}
        className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-400"
      />
    </label>
  );
}