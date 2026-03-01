import type { Exercise } from "../types";

type Props = {
  exercises: Exercise[];
  onAddToWorkout: (exerciseId: string) => void;
};

export function ExerciseList({ exercises, onAddToWorkout }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-900">Exercise library</h2>
        <span className="text-xs text-zinc-500">{exercises.length} items</span>
      </div>

      <div className="mt-3 space-y-2">
        {exercises.map((ex) => (
          <div
            key={ex.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 p-3"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-zinc-900">{ex.name}</div>
              {ex.notes ? <div className="mt-1 text-xs text-zinc-500">{ex.notes}</div> : null}
              {ex.videoUrl ? (
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
                >
                  Video
                </a>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => onAddToWorkout(ex.id)}
              className="shrink-0 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}