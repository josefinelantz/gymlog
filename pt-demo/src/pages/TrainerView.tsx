import type { Client, Exercise, LogEntry, Trainer, Workout } from "../types";
import { AddExerciseForm } from "../components/AddExerciseForm";
import { ClientCard } from "../components/ClientCard";
import { ExerciseList } from "../components/ExerciseList";
import { ProgressChart } from "../components/ProgressChart";
import { WorkoutEditor } from "../components/WorkoutEditor";

type Props = {
  trainer: Trainer;
  client: Client;
  exercises: Exercise[];
  workout: Workout;
  logs: LogEntry[];
  selectedExerciseId: string;
  onChangeSelectedExerciseId: (id: string) => void;

  onCreateExercise: (exercise: Exercise) => void;
  onAddExerciseToWorkout: (exerciseId: string) => void;
  onUpdateWorkout: (workout: Workout) => void;
};

export function TrainerView({
  trainer,
  client,
  exercises,
  workout,
  logs,
  selectedExerciseId,
  onChangeSelectedExerciseId,
  onCreateExercise,
  onAddExerciseToWorkout,
  onUpdateWorkout,
}: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-zinc-500">Trainer</div>
        <div className="text-2xl font-semibold text-zinc-900">{trainer.name}</div>
        <div className="text-sm text-zinc-500">
          Demo flow: build workout → client logs → progress updates instantly.
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <ClientCard client={client} subtitle="Primary client (demo)" />
          <AddExerciseForm trainerId={trainer.id} onCreate={onCreateExercise} />
        </div>

        <div className="space-y-4">
          <ExerciseList exercises={exercises} onAddToWorkout={onAddExerciseToWorkout} />
        </div>

        <div className="space-y-4">
          <WorkoutEditor workout={workout} exercises={exercises} onUpdateWorkout={onUpdateWorkout} />
        </div>
      </div>

      <div className="mt-6">
        <ProgressChart
          logs={logs.filter((l) => l.clientId === client.id)}
          exercises={exercises}
          selectedExerciseId={selectedExerciseId}
          onChangeSelectedExerciseId={onChangeSelectedExerciseId}
        />
      </div>
    </div>
  );
}