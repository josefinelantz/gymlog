import { useMemo, useState } from "react";
import "./index.css";

import type { Client, Exercise, Screen, Workout, WorkoutLog } from "./types";
import { demoClients, demoExercises, demoWorkouts, demoWorkoutLogs } from "./data/demoData";

import { TopBar } from "./components/TopBar";

import { PTHome } from "./pages/PTHome";
import { CreateClient } from "./pages/CreateClient";
import { ExerciseLibrary } from "./pages/ExerciseLibrary";
import { PTClientHome } from "./pages/PTClientHome";
import { WorkoutEditor } from "./pages/WorkoutEditor";
import { ClientHome } from "./pages/ClientHome";
import { ClientWorkout } from "./pages/ClientWorkout";

export default function App() {
  // ✅ Screen innehåller mode + name
  const [screen, setScreen] = useState<Screen>({ mode: "pt", name: "home" });

  const [clients, setClients] = useState<Client[]>(demoClients);
  const [exercises, setExercises] = useState<Exercise[]>(demoExercises);
  const [workouts, setWorkouts] = useState<Workout[]>(demoWorkouts);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(demoWorkoutLogs);

  // Kom ihåg vilken client som är “aktiv” för mode-switch
  const [activeClientId, setActiveClientId] = useState<string>(demoClients[0]?.id ?? "");

  function rid() {
    return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
  }

  function getDefaultClientId(): string | undefined {
    // 1) om screen har clientId: använd den
    if ("clientId" in screen) return screen.clientId;
    // 2) annars activeClientId om den finns
    if (activeClientId) return activeClientId;
    // 3) annars första client i listan
    return clients[0]?.id;
  }

  // -------- Navigation helpers (ALLTID sätt en giltig Screen) --------

  function goPtHome() {
    setScreen({ mode: "pt", name: "home" } as Screen);
  }

  function goPtCreateClient() {
    setScreen({ mode: "pt", name: "createClient" } as Screen);
  }

  function goPtExerciseLibrary() {
    setScreen({ mode: "pt", name: "exerciseLibrary" } as Screen);
  }

  function goPtClient(clientId: string) {
    setActiveClientId(clientId);
    setScreen({ mode: "pt", name: "client", clientId } as Screen);
  }

  function goPtWorkoutEditor(clientId: string, workoutId: string) {
    setActiveClientId(clientId);
    setScreen({ mode: "pt", name: "workoutEditor", clientId, workoutId } as Screen);
  }

  function goClientHome(clientId?: string) {
    const cid = clientId ?? getDefaultClientId();
    if (!cid) {
      // inga clients → stanna i PT home
      goPtHome();
      return;
    }
    setActiveClientId(cid);
    setScreen({ mode: "client", name: "home", clientId: cid } as Screen);
  }

  function goClientWorkout(clientId: string, workoutId: string) {
    setActiveClientId(clientId);
    setScreen({ mode: "client", name: "workout", clientId, workoutId } as Screen);
  }

  function toggleMode() {
    if (screen.mode === "pt") {
      goClientHome();
    } else {
      // till PT: om vi vet clientId -> gå till den klientens PT-sida, annars PT home
      if ("clientId" in screen) goPtClient(screen.clientId);
      else goPtHome();
    }
  }

  function back() {
    // Minimal “back”: alltid till respektive home för mode
    if (screen.mode === "pt") {
      goPtHome();
    } else {
      const cid = getDefaultClientId();
      if (cid) goClientHome(cid);
      else goPtHome();
    }
  }

  // -------- Domain actions --------

  function createClient(name: string) {
    const c: Client = { id: `c_${rid()}`, name };
    setClients((prev) => [c, ...prev]);
    setActiveClientId(c.id);
    // direkt till klientens PT-sida
    goPtClient(c.id);
  }

  function addExercise(name: string, notes?: string): string {
    const ex: Exercise = { id: `e_${rid()}`, name, notes };
    setExercises((prev) => [ex, ...prev]);
    return ex.id;
  }

  function createWorkout(clientId: string) {
    const w: Workout = { id: `w_${rid()}`, clientId, name: "New workout", items: [] };
    setWorkouts((prev) => [...prev, w]);
    goPtWorkoutEditor(clientId, w.id);
  }

  function saveWorkout(updated: Workout) {
    setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  }

  function saveWorkoutLog(log: WorkoutLog) {
    setWorkoutLogs((prev) => [...prev, log]);
  }

  // -------- Derived --------

  const subtitle = useMemo(() => {
    if ("clientId" in screen) {
      const c = clients.find((x) => x.id === screen.clientId);
      return c?.name ?? "";
    }
    return "";
  }, [screen, clients]);

  const leftAction =
    screen.mode === "pt" && screen.name === "home"
      ? undefined
      : { label: "Back", onClick: back };

  const rightAction =
    screen.mode === "pt" &&
    (screen.name === "client" || screen.name === "workoutEditor")
      ? { label: "Exercises", onClick: goPtExerciseLibrary }
      : undefined;

  // -------- Render --------

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <TopBar
        title={screen.mode === "pt" ? "PT" : "Client"}
        subtitle={subtitle}
        mode={screen.mode}
        onToggleMode={toggleMode}
        leftAction={leftAction}
        rightAction={rightAction}
      />

      {/* ---------------- PT MODE ---------------- */}
      {screen.mode === "pt" && screen.name === "home" ? (
        <PTHome
          clients={clients}
          onNewClient={goPtCreateClient}
          onGoClient={(clientId) => goPtClient(clientId)}
          onGoExerciseLibrary={goPtExerciseLibrary}
        />
      ) : null}

      {screen.mode === "pt" && screen.name === "createClient" ? (
        <CreateClient onCreate={createClient} />
      ) : null}

      {screen.mode === "pt" && screen.name === "exerciseLibrary" ? (
        <ExerciseLibrary
          exercises={exercises}
          onAddExercise={(name, notes) => {
            addExercise(name, notes);
          }}
        />
      ) : null}

      {screen.mode === "pt" && screen.name === "client" ? (() => {
        const client = clients.find((c) => c.id === screen.clientId);
        if (!client) return null;

        const clientWorkouts = workouts.filter((w) => w.clientId === client.id);
        const clientLogs = workoutLogs.filter((l) => l.clientId === client.id);

        return (
          <PTClientHome
            client={client}
            workouts={clientWorkouts}
            logs={clientLogs}
            onNewWorkout={() => createWorkout(client.id)}
            onEditWorkout={(workoutId) => goPtWorkoutEditor(client.id, workoutId)}
          />
        );
      })() : null}

      {screen.mode === "pt" && screen.name === "workoutEditor" ? (() => {
        const w = workouts.find((x) => x.id === screen.workoutId);
        if (!w) return null;

        return (
          <WorkoutEditor
            workout={w}
            exercises={exercises}
            onCreateExerciseInline={(name) => addExercise(name)}
            onSave={(updated) => {
              // ✅ Spara men stanna kvar i editorn
              saveWorkout(updated);
            }}
            onDone={(updated) => {
              // ✅ När du trycker “Klar”: spara och gå tillbaka till PT client
              saveWorkout(updated);
              goPtClient(updated.clientId);
            }}
          />
        );
      })() : null}

      {/* ---------------- CLIENT MODE ---------------- */}
      {screen.mode === "client" && screen.name === "home" ? (() => {
        const client = clients.find((c) => c.id === screen.clientId);
        if (!client) return null;

        const clientWorkouts = workouts.filter((w) => w.clientId === client.id);
        const clientLogs = workoutLogs.filter((l) => l.clientId === client.id);

        return (
          <ClientHome
            client={client}
            workouts={clientWorkouts}
            logs={clientLogs}
            onOpenWorkout={(workoutId) => goClientWorkout(client.id, workoutId)}
          />
        );
      })() : null}

      {screen.mode === "client" && screen.name === "workout" ? (() => {
        const client = clients.find((c) => c.id === screen.clientId);
        const w = workouts.find((x) => x.id === screen.workoutId);
        if (!client || !w) return null;

        return (
          <ClientWorkout
            client={client}
            workout={w}
            exercises={exercises}
            onSave={(log) => {
              saveWorkoutLog(log);
              goClientHome(client.id);
            }}
          />
        );
      })() : null}
    </div>
  );
}