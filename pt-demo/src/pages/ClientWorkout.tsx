import { useEffect, useMemo, useState } from "react";
import type { Client, Exercise, Workout, WorkoutLog, WorkoutItemLog } from "../types";

type Draft = { 
    sets: string; 
    reps: string; 
    weightKg: string;
    note: string; 
};

export function ClientWorkout({
  client,
  workout,
  exercises,
  logs,
  onSave,
}: {
  client: Client;
  workout: Workout;
  exercises: Exercise[];
  logs: WorkoutLog[];
  onSave: (log: WorkoutLog) => void;
}) {
  const exerciseById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const latestLogForWorkout = useMemo(() => {
    const relevant = logs
      .filter((l) => l.workoutId === workout.id)
      .slice()
      .sort((a, b) => b.dateISO.localeCompare(a.dateISO));
    if (relevant.length === 0) return undefined;
    const today = relevant.find((l) => l.dateISO === todayISO);
    return today ?? relevant[0];
  }, [logs, workout.id, todayISO]);
    const [draft, setDraft] = useState<Record<string, Draft>>(() => {
    const init: Record<string, Draft> = {};

    // If we have a previous log (today or latest), prefill from it
    const byItemId = new Map(latestLogForWorkout?.items.map((x) => [x.workoutItemId, x]));

    for (const it of workout.items) {
      const prev = byItemId.get(it.id);
      init[it.id] = {
        sets: String(prev?.actualSets ?? it.targetSets),
        reps: String(prev?.actualReps ?? it.targetReps),
        weightKg: String(prev?.actualWeightKg ?? it.targetWeightKg ?? ""),
        note: String(prev?.clientNote ?? ""),
      };
    }
    return init;
  });
  function setField(itemId: string, k: keyof Draft, v: string) {
    setDraft((p) => ({ 
        ...p, 
        [itemId]: { 
            ...(p[itemId] ?? { sets: "", reps: "", weightKg: "", note: "" }), 
            [k]: v, 
        }, 
    }));
  }
    useEffect(() => {
    const init: Record<string, Draft> = {};
    const byItemId = new Map(latestLogForWorkout?.items.map((x) => [x.workoutItemId, x]));
    for (const it of workout.items) {
      const prev = byItemId.get(it.id);
      init[it.id] = {
        sets: String(prev?.actualSets ?? it.targetSets),
        reps: String(prev?.actualReps ?? it.targetReps),
        weightKg: String(prev?.actualWeightKg ?? it.targetWeightKg ?? ""),
        note: String(prev?.clientNote ?? ""),
      };
    }
    setDraft(init);
  }, [workout.id, workout.items, latestLogForWorkout, todayISO]);

  const canSave = useMemo(() => workout.items.length > 0, [workout.items.length]);

  function handleSave() {
    const items: WorkoutItemLog[] = workout.items.map((it) => {
      const d = draft[it.id];
      return {
        workoutItemId: it.id,
        actualSets: Number(d?.sets || it.targetSets),
        actualReps: Number(d?.reps || it.targetReps),
        actualWeightKg: Number(d?.weightKg || it.targetWeightKg || 0),
        clientNote: d?.note?.trim() || undefined,
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
          const d = draft[it.id] ?? { sets: "", reps: "", weightKg: "", note: "" };

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

              <div className="mt-3">
                <div className="text-xs text-zinc-500">Your notes (private)</div>
                    <textarea
                        value={d.note}
                        onChange={(e) => setField(it.id, "note", e.target.value )}
                        placeholder="Write stuff you want to remember.."
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                        rows={2}
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