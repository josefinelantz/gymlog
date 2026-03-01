import { useMemo, useState } from "react";
import type { Client, Exercise, Workout, WorkoutLog, WorkoutItemLog } from "../types";

type Draft = { sets: string; reps: string; weightKg: string };

export function ClientWorkout({
  client,
  workout,
  exercises,
  onSave,
}: {
  client: Client;
  workout: Workout;
  exercises: Exercise[];
  onSave: (log: WorkoutLog) => void;
}) {
  const exerciseById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [draft, setDraft] = useState<Record<string, Draft>>(() => {
    const init: Record<string, Draft> = {};
    for (const it of workout.items) {
      init[it.id] = {
        sets: String(it.targetSets),
        reps: String(it.targetReps),
        weightKg: String(it.targetWeightKg ?? ""),
      };
    }
    return init;
  });

  function setField(itemId: string, k: keyof Draft, v: string) {
    setDraft((p) => ({ ...p, [itemId]: { ...(p[itemId] ?? { sets: "", reps: "", weightKg: "" }), [k]: v } }));
  }

  const canSave = useMemo(() => workout.items.length > 0, [workout.items.length]);

  function handleSave() {
    const items: WorkoutItemLog[] = workout.items.map((it) => {
      const d = draft[it.id];
      return {
        workoutItemId: it.id,
        actualSets: Number(d?.sets || it.targetSets),
        actualReps: Number(d?.reps || it.targetReps),
        actualWeightKg: Number(d?.weightKg || it.targetWeightKg || 0),
      };
    });

    onSave({
      id: `log_${rid()}`,
      workoutId: workout.id,
      clientId: client.id,
      dateISO: todayISO,
      items,
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-xs text-zinc-500">Workout</div>
        <div className="mt-1 text-base font-semibold text-zinc-900">{workout.name}</div>
        <div className="mt-1 text-xs text-zinc-500">{todayISO}</div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
        {workout.items.map((it) => {
          const ex = exerciseById.get(it.exerciseId);
          const d = draft[it.id] ?? { sets: "", reps: "", weightKg: "" };

          return (
            <div key={it.id} className="rounded-xl border border-zinc-200 p-3">
              <div className="text-sm font-semibold text-zinc-900">{ex?.name ?? "Exercise"}</div>
              <div className="mt-1 text-xs text-zinc-500">
                Target: {it.targetSets}×{it.targetReps} @ {it.targetWeightKg ?? "—"} kg
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <input
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold outline-none"
                  value={d.sets}
                  onChange={(e) => setField(it.id, "sets", e.target.value)}
                  placeholder="Sets"
                />
                <input
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold outline-none"
                  value={d.reps}
                  onChange={(e) => setField(it.id, "reps", e.target.value)}
                  placeholder="Reps"
                />
                <input
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold outline-none"
                  value={d.weightKg}
                  onChange={(e) => setField(it.id, "weightKg", e.target.value)}
                  placeholder="kg"
                />
              </div>
            </div>
          );
        })}

        {workout.items.length === 0 ? (
          <div className="text-sm text-zinc-500">No items in this workout.</div>
        ) : null}

        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className={[
            "w-full rounded-xl px-4 py-3 text-sm font-semibold",
            canSave ? "bg-zinc-900 text-white hover:bg-zinc-800" : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
          ].join(" ")}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function rid() {
  return Math.random().toString(16).slice(2);
}