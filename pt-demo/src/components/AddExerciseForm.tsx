import { useMemo, useState } from "react";
import type { Exercise } from "../types";

type Props = {
  trainerId: string;
  onCreate: (exercise: Exercise) => void;
};

export function AddExerciseForm({ trainerId, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const canSave = useMemo(() => name.trim().length >= 2, [name]);

  function reset() {
    setName("");
    setNotes("");
    setVideoUrl("");
  }

  function handleSave() {
    if (!canSave) return;

    const exercise: Exercise = {
      id: `e_${cryptoRandomId()}`,
      trainerId,
      name: name.trim(),
      notes: notes.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
    };

    onCreate(exercise);
    reset();
    setOpen(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-900">Add exercise</h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={[
            "rounded-xl px-3 py-2 text-xs font-semibold transition",
            open ? "bg-zinc-100 text-zinc-900" : "bg-zinc-900 text-white hover:bg-zinc-800",
          ].join(" ")}
        >
          {open ? "Close" : "+ New"}
        </button>
      </div>

      {open ? (
        <div className="mt-3 space-y-3">
          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Romanian Deadlift"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
          </Field>

          <Field label="Notes (optional)">
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cue, tempo, focus…"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
          </Field>

          <Field label="Video URL (optional)">
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
          </Field>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={[
              "w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              canSave
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "cursor-not-allowed bg-zinc-100 text-zinc-400",
            ].join(" ")}
          >
            Save exercise
          </button>

          <div className="text-xs text-zinc-500">
            Demo: exercise is stored in frontend state only.
          </div>
        </div>
      ) : (
        <div className="mt-2 text-sm text-zinc-500">
          Create an exercise and add it to the workout with one click.
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-zinc-700">{label}</div>
      {children}
    </label>
  );
}

function cryptoRandomId(): string {
  // Works in modern browsers; fine for demo
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}