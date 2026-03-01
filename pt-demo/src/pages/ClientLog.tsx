import { useMemo, useState } from "react";
import type { Client, ClientPlan, Exercise, LogEntry } from "../types";

type Draft = { sets: string; reps: string; weightKg: string };

export function ClientLog({
  client,
  plan,
  exercises,
  onSave,
}: {
  client: Client;
  plan: ClientPlan;
  exercises: Exercise[];
  onSave: (newLogs: LogEntry[]) => void;
}) {
  const exerciseById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [draft, setDraft] = useState<Record<string, Draft>>(() => {
    const init: Record<string, Draft> = {};
    for (const it of plan.items) {
      init[it.exerciseId] = { sets: String(it.setsTarget), reps: String(it.repsTarget), weightKg: "" };
    }
    return init;
  });

  function setField(exerciseId: string, k: keyof Draft, v: string) {
    setDraft((p) => ({ ...p, [exerciseId]: { ...(p[exerciseId] ?? { sets: "", reps: "", weightKg: "" }), [k]: v } }));
  }

  const canSave = useMemo(() => {
    return plan.items.some((it) => Number(draft[it.exerciseId]?.weightKg) > 0);
  }, [draft, plan.items]);

  function handleSave() {
    const out: LogEntry[] = [];
    for (const it of plan.items) {
      const d = draft[it.exerciseId];
      if (!d) continue;
      const weightKg = Number(d.weightKg);
      const reps = Number(d.reps);
      const sets = Number(d.sets);
      if (!(weightKg > 0 && reps > 0 && sets > 0)) continue;

      out.push({
        id: `l_${rid()}`,
        clientId: client.id,
        exerciseId: it.exerciseId,
        dateISO: todayISO,
        sets,
        reps,
        weightKg,
      });
    }
    if (out.length) onSave(out);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="text-xs font-medium text-zinc-500">Client logging</div>
        <div className="mt-1 text-lg font-semibold text-zinc-900">{client.name}</div>
        <div className="mt-1 text-xs text-zinc-500">{plan.workoutName} • {todayISO}</div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3">
        {plan.items.map((it) => {
          const ex = exerciseById.get(it.exerciseId);
          const d = draft[it.exerciseId] ?? { sets: "", reps: "", weightKg: "" };
          return (
            <div key={it.id} className="rounded-2xl border border-zinc-200 p-3">
              <div className="text-sm font-semibold text-zinc-900">{ex?.name ?? "Exercise"}</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <input className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold"
                  value={d.sets} onChange={(e) => setField(it.exerciseId, "sets", e.target.value)} placeholder="Sets" />
                <input className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold"
                  value={d.reps} onChange={(e) => setField(it.exerciseId, "reps", e.target.value)} placeholder="Reps" />
                <input className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold"
                  value={d.weightKg} onChange={(e) => setField(it.exerciseId, "weightKg", e.target.value)} placeholder="kg" />
              </div>
            </div>
          );
        })}

        {plan.items.length === 0 ? (
          <div className="text-sm text-zinc-500">No assigned exercises yet.</div>
        ) : null}

        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className={[
            "w-full rounded-2xl px-4 py-3 text-sm font-semibold",
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