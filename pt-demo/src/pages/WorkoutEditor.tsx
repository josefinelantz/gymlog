import { useEffect, useMemo, useState } from "react";
import type { Exercise, FocusArea, Workout, WorkoutItem } from "../types";

export function WorkoutEditor({
  workout,
    exercises,
  focusAreas,
  onSave,
  onDone,
  onCreateExerciseInline,
}: {
  workout: Workout;
  exercises: Exercise[];
  focusAreas: FocusArea[];
  onSave: (workout: Workout) => void; // save draft while staying here
  onDone: (workout: Workout) => void; // user explicitly finishes editing
  onCreateExerciseInline: (name: string) => string; // returns new exerciseId
}) {
  const [name, setName] = useState(workout.name);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [pickExerciseId, setPickExerciseId] = useState(exercises[0]?.id ?? "");

  // Sync local name if user opens another workout
  useEffect(() => {
    setName(workout.name);
  }, [workout.id, workout.name]);

  // Keep dropdown valid if exercise list changes
  useEffect(() => {
    if (!pickExerciseId && exercises[0]?.id) setPickExerciseId(exercises[0].id);
    if (pickExerciseId && !exercises.some((e) => e.id === pickExerciseId)) {
      setPickExerciseId(exercises[0]?.id ?? "");
    }
  }, [exercises, pickExerciseId]);

  const exerciseById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);

  function save(nextItems: WorkoutItem[]) {
    onSave({
      ...workout,
      name: name.trim() || workout.name,
      items: nextItems,
    });
  }

  function addItem(exerciseId: string) {
    const item: WorkoutItem = {
      id: `wi_${rid()}`,
      exerciseId,
      targetSets: 3,
      targetReps: 8,
      targetWeightKg: undefined,
    };
    save([...workout.items, item]);
  }

  function updateItem(itemId: string, patch: Partial<WorkoutItem>) {
    const next = workout.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it));
    save(next);
  }

  function removeItem(itemId: string) {
    save(workout.items.filter((it) => it.id !== itemId));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold text-zinc-900">Edit workout</div>

        <label className="mt-4 block">
          <div className="text-xs font-medium text-zinc-600">Workout name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
        </label>

        <button
          type="button"
          onClick={() => onDone({ ...workout, name: name.trim() || workout.name })}
          className="mt-4 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Klar
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
        <div className="text-sm font-semibold text-zinc-900">Add exercise</div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={pickExerciseId}
            onChange={(e) => setPickExerciseId(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm font-semibold"
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => pickExerciseId && addItem(pickExerciseId)}
            className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Add
          </button>

          <div className="hidden sm:block text-xs text-zinc-500 self-center">
            Or create a new exercise below
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            placeholder="New exercise name…"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400 sm:col-span-2"
          />
          <button
            type="button"
            onClick={() => {
              const n = newExerciseName.trim();
              if (n.length < 2) return;
              const newId = onCreateExerciseInline(n);
              setNewExerciseName("");
              setPickExerciseId(newId);
              addItem(newId);
            }}
            className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
          >
            Create + add
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold text-zinc-900">Items</div>

        <div className="mt-3 space-y-2">
          {workout.items.map((it) => (
            <div key={it.id} className="rounded-xl border border-zinc-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 truncate">
                    {exerciseById.get(it.exerciseId)?.name ?? "Unknown"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-200"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3">
                <div className="text-xs text-zinc-500">Focus</div>
                <select
                  value={it.focusAreaId ?? ""}
                  onChange={(e) => updateItem(it.id, { focusAreaId: e.target.value || undefined })}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold"
                >
                  <option value="">—</option>
                  {focusAreas.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Num
                  label="Sets"
                  value={it.targetSets}
                  onChange={(v) => updateItem(it.id, { targetSets: v })}
                />
                <Num
                  label="Reps"
                  value={it.targetReps}
                  onChange={(v) => updateItem(it.id, { targetReps: v })}
                />
                <Num
                  label="kg"
                  value={it.targetWeightKg ?? 0}
                  onChange={(v) => updateItem(it.id, { targetWeightKg: v })}
                  allowZero
                />
              </div>
            </div>
          ))}

          {workout.items.length === 0 ? (
            <div className="text-sm text-zinc-500">No items yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
  allowZero,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  allowZero?: boolean;
}) {
  return (
    <label className="rounded-xl bg-zinc-50 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <input
        type="number"
        min={allowZero ? 0 : 1}
        value={value}
        onChange={(e) => onChange(Math.max(allowZero ? 0 : 1, Number(e.target.value || 0)))}
        className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm font-semibold outline-none"
      />
    </label>
  );
}

function rid() {
  return Math.random().toString(16).slice(2);
}