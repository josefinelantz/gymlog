import { useMemo, useState } from "react";
import type { Exercise, FocusArea } from "../types";

export function ExerciseLibrary({
  exercises,
  focusAreas,
  onAddExercise,
  onAddFocusArea,
  onUpdateFocusArea,
  onDeleteFocusArea,
}: {
  exercises: Exercise[];
  focusAreas: FocusArea[];
  onAddExercise: (name: string, notes?: string) => void;

  onAddFocusArea: (name: string) => void;
  onUpdateFocusArea: (id: string, name: string) => void;
  onDeleteFocusArea: (id: string) => void;
}) {
  const [exName, setExName] = useState("");
  const [exNotes, setExNotes] = useState("");

  const [faName, setFaName] = useState("");

  const canAddEx = useMemo(() => exName.trim().length >= 2, [exName]);
  const canAddFa = useMemo(() => faName.trim().length >= 2, [faName]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      {/* Exercises */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold text-zinc-900">Exercise library</div>

        <div className="mt-3 space-y-2">
          <input
            value={exName}
            onChange={(e) => setExName(e.target.value)}
            placeholder="New exercise name…"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <input
            value={exNotes}
            onChange={(e) => setExNotes(e.target.value)}
            placeholder="Notes (optional)…"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="button"
            disabled={!canAddEx}
            onClick={() => {
              onAddExercise(exName.trim(), exNotes.trim() || undefined);
              setExName("");
              setExNotes("");
            }}
            className={[
              "w-full rounded-xl px-4 py-3 text-sm font-semibold",
              canAddEx
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
            ].join(" ")}
          >
            Add exercise
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {exercises.map((e) => (
            <div key={e.id} className="rounded-xl border border-zinc-200 p-3">
              <div className="text-sm font-semibold text-zinc-900">{e.name}</div>
              {e.notes ? <div className="mt-1 text-xs text-zinc-500">{e.notes}</div> : null}
            </div>
          ))}
          {exercises.length === 0 ? (
            <div className="mt-2 text-sm text-zinc-500">No exercises yet.</div>
          ) : null}
        </div>
      </section>

      {/* Focus areas (CRUD) */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold text-zinc-900">Focus areas</div>
        <div className="mt-1 text-xs text-zinc-500">
          PT-administered list used in WorkoutEditor (e.g. Stability, Mobility).
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={faName}
            onChange={(e) => setFaName(e.target.value)}
            placeholder="New focus area…"
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="button"
            disabled={!canAddFa}
            onClick={() => {
              onAddFocusArea(faName.trim());
              setFaName("");
            }}
            className={[
              "rounded-xl px-4 py-3 text-sm font-semibold",
              canAddFa
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
            ].join(" ")}
          >
            Add
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {focusAreas.map((f) => (
            <FocusRow
              key={f.id}
              id={f.id}
              name={f.name}
              onUpdate={onUpdateFocusArea}
              onDelete={onDeleteFocusArea}
            />
          ))}

          {focusAreas.length === 0 ? (
            <div className="mt-2 text-sm text-zinc-500">No focus areas yet.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function FocusRow({
  id,
  name,
  onUpdate,
  onDelete,
}: {
  id: string;
  name: string;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState(name);

  const canSave = useMemo(() => draft.trim().length >= 2, [draft]);

  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-zinc-400"
        />

        <button
          type="button"
          disabled={!canSave}
          onClick={() => onUpdate(id, draft.trim())}
          className={[
            "rounded-lg px-3 py-2 text-xs font-semibold",
            canSave
              ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              : "bg-zinc-50 text-zinc-300 cursor-not-allowed",
          ].join(" ")}
        >
          Save
        </button>

        <button
          type="button"
          onClick={() => onDelete(id)}
          className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}