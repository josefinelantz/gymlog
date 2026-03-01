import { useMemo, useState } from "react";
import type { Exercise } from "../types";

export function ExerciseLibrary({
  exercises,
  onAddExercise,
}: {
  exercises: Exercise[];
  onAddExercise: (name: string, notes?: string) => void;
}) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const canSave = useMemo(() => name.trim().length >= 2, [name]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold text-zinc-900">Exercise library</div>

        <div className="mt-3 space-y-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New exercise name…"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)…"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              onAddExercise(name.trim(), notes.trim() || undefined);
              setName("");
              setNotes("");
            }}
            className={[
              "w-full rounded-xl px-4 py-3 text-sm font-semibold",
              canSave
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
            ].join(" ")}
          >
            Add exercise
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-xs text-zinc-500">{exercises.length} exercises</div>
        <div className="mt-3 space-y-2">
          {exercises.map((e) => (
            <div key={e.id} className="rounded-xl border border-zinc-200 p-3">
              <div className="text-sm font-semibold text-zinc-900">{e.name}</div>
              {e.notes ? <div className="mt-1 text-xs text-zinc-500">{e.notes}</div> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}