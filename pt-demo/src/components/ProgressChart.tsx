import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import type { Exercise, LogEntry } from "../types";

export function ProgressChart({
  logs,
  exercises,
  exerciseId,
  onChangeExerciseId,
}: {
  logs: LogEntry[];
  exercises: Exercise[];
  exerciseId: string;
  onChangeExerciseId: (id: string) => void;
}) {
  const data = useMemo(() => {
    return logs
      .filter((l) => l.exerciseId === exerciseId)
      .slice()
      .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
      .map((l) => ({ date: l.dateISO.slice(5), weightKg: l.weightKg }));
  }, [logs, exerciseId]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-zinc-900">Progress</div>
        <select
          value={exerciseId}
          onChange={(e) => onChangeExerciseId(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-400"
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 h-48 rounded-xl bg-zinc-50 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weightKg" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data.length === 0 ? (
        <div className="mt-3 text-xs text-zinc-500">No logs yet for this exercise.</div>
      ) : null}
    </div>
  );
}