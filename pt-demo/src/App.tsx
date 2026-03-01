import { useMemo, useState } from "react";
import "./index.css";
import type { Exercise, LogEntry, ViewMode, Workout, WorkoutExercise } from "./types";
import { TopBar } from "./components/TopBar";
import { TrainerView } from "./pages/TrainerView";
import { ClientView } from "./pages/ClientView";
import { demoClient, demoExercises, demoLogs, demoTrainer, demoWorkout } from "./data/demoData";
import { Toast } from "./components/Toast";

export default function App() {
  const [mode, setMode] = useState<ViewMode>("trainer");

  const [exercises, setExercises] = useState<Exercise[]>(demoExercises);
  const [workout, setWorkout] = useState<Workout>(demoWorkout);
  const [logs, setLogs] = useState<LogEntry[]>(demoLogs);

  const [toastOpen, setToastOpen] = useState(false);

  const exerciseOptions = useMemo(() => exercises.filter((e) => !e.archived), [exercises]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(() => {
    // Prefer Squat in demo; fallback to first exercise
    const squat = demoExercises.find((e) => e.name.toLowerCase() === "squat")?.id;
    return squat ?? demoExercises[0]?.id ?? "e1";
  });

  function createExercise(ex: Exercise) {
    setExercises((prev) => [ex, ...prev]);
    // If this is the first exercise ever, select it
    setSelectedExerciseId((prev) => prev || ex.id);
  }

  function addExerciseToWorkout(exerciseId: string) {
    // prevent duplicates
    if (workout.items.some((it) => it.exerciseId === exerciseId)) return;

    const nextItem: WorkoutExercise = {
      id: `we_${cryptoRandomId()}`,
      exerciseId,
      setsTarget: 3,
      repsTarget: 8,
    };

    setWorkout((prev) => ({ ...prev, items: [...prev.items, nextItem] }));
  }

  function saveLogs(newLogs: LogEntry[]) {
    // Upsert by (date + client + exercise) for demo convenience
    setLogs((prev) => {
      const next = [...prev];
      for (const nl of newLogs) {
        const idx = next.findIndex(
          (l) =>
            l.clientId === nl.clientId &&
            l.exerciseId === nl.exerciseId &&
            l.dateISO === nl.dateISO
        );
        if (idx >= 0) next[idx] = nl;
        else next.push(nl);
      }
      return next;
    });
  }

  function onSavedToast() {
    setToastOpen(true);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <TopBar
        mode={mode}
        onChangeMode={setMode}
        brandName="DemoFit"
        tagline="Whitelabel-style PT demo"
      />

      {mode === "trainer" ? (
        <TrainerView
          trainer={demoTrainer}
          client={demoClient}
          exercises={exerciseOptions}
          workout={workout}
          logs={logs}
          selectedExerciseId={selectedExerciseId}
          onChangeSelectedExerciseId={setSelectedExerciseId}
          onCreateExercise={createExercise}
          onAddExerciseToWorkout={addExerciseToWorkout}
          onUpdateWorkout={setWorkout}
        />
      ) : (
        <ClientView
          client={demoClient}
          workout={workout}
          exercises={exerciseOptions}
          onSaveLogs={saveLogs}
          onSaved={onSavedToast}
        />
      )}

      <Toast message="Saved ✅" open={toastOpen} onClose={() => setToastOpen(false)} />
    </div>
  );
}

function cryptoRandomId(): string {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}