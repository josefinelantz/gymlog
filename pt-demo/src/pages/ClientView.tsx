import type { Client, Exercise, Workout } from "../types";
import { LogWorkout } from "../components/LogWorkout";

type Props = {
  client: Client;
  workout: Workout;
  exercises: Exercise[];
  onSaveLogs: Parameters<typeof LogWorkout>[0]["onSaveLogs"];
  onSaved: () => void;
};

export function ClientView({ client, workout, exercises, onSaveLogs, onSaved }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-zinc-500">Client</div>
        <div className="text-2xl font-semibold text-zinc-900">{client.name}</div>
        <div className="text-sm text-zinc-500">
          Fill in weight/reps/sets and save. Then switch to PT view to see the chart update.
        </div>
      </div>

      <div className="mt-6">
        <LogWorkout
          clientName={client.name}
          clientId={client.id}
          workout={workout}
          exercises={exercises}
          onSaveLogs={onSaveLogs}
          onSaved={onSaved}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm">
        <div className="font-semibold text-zinc-900">Demo tip</div>
        <div className="mt-1">
          Log Squat today (e.g. 50kg) → switch back to PT view → select “Squat” in the dropdown.
        </div>
      </div>
    </div>
  );
}