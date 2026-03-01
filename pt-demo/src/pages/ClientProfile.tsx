import { useMemo, useState } from "react";
import type { Client, ClientPlan, Exercise, LogEntry } from "../types";
import { ProgressChart } from "../components/ProgressChart";

export function ClientProfile({
  client,
  exercises,
  plan,
  logs,
  onSetPlan,
  onOpenClientLog,
}: {
  client: Client;
  exercises: Exercise[];
  plan: ClientPlan;
  logs: LogEntry[];
  onSetPlan: (plan: ClientPlan) => void;
  onOpenClientLog: () => void;
}) {
  const exerciseById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(() => exercises[0]?.id ?? "");

  function addToPlan(exerciseId: string) {
    if (plan.items.some((i) => i.exerciseId === exerciseId)) return;
    onSetPlan({
      ...plan,
      items: [...plan.items, { id: `a_${rid()}`, exerciseId, setsTarget: 3, repsTarget: 8 }],
    });
    setSelectedExerciseId(exerciseId);
  }

  function updateItem(itemId: string, patch: Partial<{ setsTarget: number; repsTarget: number }>) {
    onSetPlan({
      ...plan,
      items: plan.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="text-xs font-medium text-zinc-500">Client</div>
        <div className="mt-1 text-lg font-semibold text-zinc-900">{client.name}</div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onOpenClientLog}
            className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Logga som klient
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-zinc-900">Assign exercises</div>
          <div className="text-xs text-zinc-500">{plan.workoutName}</div>
        </div>

        <div className="mt-3 space-y-2">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => addToPlan(ex.id)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-left hover:bg-zinc-50"
            >
              <div className="text-sm font-semibold text-zinc-900">{ex.name}</div>
              <div className="text-xs text-zinc-500">Add to client plan</div>
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-zinc-200 pt-4">
          <div className="text-sm font-semibold text-zinc-900">Current plan</div>

          <div className="mt-3 space-y-2">
            {plan.items.map((it) => (
              <div key={it.id} className="rounded-2xl border border-zinc-200 p-3">
                <div className="text-sm font-semibold text-zinc-900">
                  {exerciseById.get(it.exerciseId)?.name ?? "Unknown"}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="rounded-2xl bg-zinc-50 p-3">
                    <div className="text-xs text-zinc-500">Sets</div>
                    <input
                      type="number"
                      min={1}
                      value={it.setsTarget}
                      onChange={(e) => updateItem(it.id, { setsTarget: Math.max(1, Number(e.target.value || 1)) })}
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold outline-none"
                    />
                  </label>

                  <label className="rounded-2xl bg-zinc-50 p-3">
                    <div className="text-xs text-zinc-500">Reps</div>
                    <input
                      type="number"
                      min={1}
                      value={it.repsTarget}
                      onChange={(e) => updateItem(it.id, { repsTarget: Math.max(1, Number(e.target.value || 1)) })}
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold outline-none"
                    />
                  </label>
                </div>
              </div>
            ))}

            {plan.items.length === 0 ? (
              <div className="text-sm text-zinc-500">No exercises assigned yet.</div>
            ) : null}
          </div>
        </div>
      </div>

      <ProgressChart
        logs={logs}
        exercises={exercises}
        exerciseId={selectedExerciseId || exercises[0]?.id || ""}
        onChangeExerciseId={setSelectedExerciseId}
      />
    </div>
  );
}

function rid() {
  return Math.random().toString(16).slice(2);
}