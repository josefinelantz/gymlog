import { useMemo, useState } from "react";
import type { Exercise, LogEntry, Workout } from "../types";

type Props = {
  clientName: string;
  clientId: string;
  workout: Workout;
  exercises: Exercise[];
  onSaveLogs: (logs: LogEntry[]) => void;
  onSaved: () => void;
};

type DraftRow = {
  weightKg: string;
  reps: string;
  sets: string;
};

export function LogWorkout({
  clientName,
  clientId,
  workout,
  exercises,
  onSaveLogs,
  onSaved,
}: Props) {
  const exerciseById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);

  const [draft, setDraft] = useState<Record<string, DraftRow>>(() => {
    const initial: Record<string, DraftRow> = {};
    for (const it of workout.items) {
      initial[it.exerciseId] = {
        weightKg: "",
        reps: String(it.repsTarget),
        sets: String(it.setsTarget),
      };
    }
    return initial;
  });

  function setDraftField(exerciseId: string, field: keyof DraftRow, value: string) {
    setDraft((prev) => ({
      ...prev,
      [exerciseId]: { ...(prev[exerciseId] ?? { weightKg: "", reps: "", sets: "" }), [field]: value },
    }));
  }

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function handleSave() {
    const newLogs: LogEntry[] = [];

    for (const it of workout.items) {
      const row = draft[it.exerciseId];
      if (!row) continue;

      const weightKg = Number(row.weightKg);
      const reps = Number(row.reps);
      const sets = Number(row.sets);

      // Only create a log if weight and reps look valid
      if (!Number.isFinite(weightKg) || weightKg <= 0) continue;
      if (!Number.isFinite(reps) || reps <= 0) continue;
      if (!Number.isFinite(sets) || sets <= 0) continue;

      newLogs.push({
        id: `l_${cryptoRandomId()}`,
        clientId,
        workoutId: workout.id,
        exerciseId: it.exerciseId,
        dateISO: todayISO,
        sets,
        reps,
        weightKg,
      });
    }

    if (newLogs.length === 0) return;

    onSaveLogs(newLogs);
    onSaved();

    // Reset weight only (keep targets as convenience)
    setDraft((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = { ...next[key], weightKg: "" };
      }
      return next;
    });
  }

  const canSave = useMemo(() => {
    return workout.items.some((it) => {
      const row = draft[it.exerciseId];
      if (!row) return false;
      const w = Number(row.weightKg);
      const r = Number(row.reps);
      const s = Number(row.sets);
      return w > 0 && r > 0 && s > 0;
    });
  }, [draft, workout.items]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Today’s workout</div>
          <div className="mt-1 text-xs text-zinc-500">
            {clientName} • {workout.name} • {todayISO}
          </div>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
          Client
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {workout.items.map((it) => {
          const ex = exerciseById.get(it.exerciseId);
          const row = draft[it.exerciseId] ?? { weightKg: "", reps: "", sets: "" };

          return (
            <div key={it.id} className="rounded-xl border border-zinc-200 p-3">
              <div className="text-sm font-semibold text-zinc-900">{ex?.name ?? "Exercise"}</div>
              {ex?.notes ? <div className="mt-1 text-xs text-zinc-500">{ex.notes}</div> : null}

              <div className="mt-3 grid grid-cols-3 gap-2">
                <MiniInput
                  label="Sets"
                  value={row.sets}
                  onChange={(v) => setDraftField(it.exerciseId, "sets", v)}
                />
                <MiniInput
                  label="Reps"
                  value={row.reps}
                  onChange={(v) => setDraftField(it.exerciseId, "reps", v)}
                />
                <MiniInput
                  label="Weight (kg)"
                  value={row.weightKg}
                  onChange={(v) => setDraftField(it.exerciseId, "weightKg", v)}
                  placeholder="e.g. 45"
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        className={[
          "mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
          canSave
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : "cursor-not-allowed bg-zinc-100 text-zinc-400",
        ].join(" ")}
      >
        Save
      </button>

      <div className="mt-2 text-xs text-zinc-500">
        Demo: saving updates the PT chart instantly.
      </div>
    </div>
  );
}

function MiniInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-zinc-700">{label}</div>
      <input
        value={value}
        inputMode="numeric"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-400"
      />
    </label>
  );
}

function cryptoRandomId(): string {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}