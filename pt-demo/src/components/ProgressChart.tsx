import { useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Exercise, LogEntry } from "../types";

type Props = {
  logs: LogEntry[];
  exercises: Exercise[];
  selectedExerciseId: string;
  onChangeSelectedExerciseId: (id: string) => void;
};

export function ProgressChart({
  logs,
  exercises,
  selectedExerciseId,
  onChangeSelectedExerciseId,
}: Props) {
  const exerciseById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);

  const data = useMemo(() => {
    return logs
      .filter((l) => l.exerciseId === selectedExerciseId)
      .slice()
      .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
      .map((l) => ({
        date: l.dateISO.slice(5), // MM-DD for compactness
        weightKg: l.weightKg,
        reps: l.reps,
        sets: l.sets,
      }));
  }, [logs, selectedExerciseId]);

  const title = exerciseById.get(selectedExerciseId)?.name ?? "Progress";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Progress</div>
          <div className="mt-1 text-xs text-zinc-500">Simple demo chart (weight over time)</div>
        </div>

        <select
          value={selectedExerciseId}
          onChange={(e) => onChangeSelectedExerciseId(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-400"
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 rounded-xl bg-zinc-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          <div className="text-xs text-zinc-500">{data.length} points</div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weightKg" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="mt-3 text-sm text-zinc-500">
          No logs yet for this exercise. Switch to Client view and save a log.
        </div>
      ) : (
        <div className="mt-3 text-xs text-zinc-500">
          Tip: demo works best if you log “today” in Client view while PT watches.
        </div>
      )}
    </div>
  );
}