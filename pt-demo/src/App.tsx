import { useMemo, useState } from "react";
import "./index.css";

import type {
  Client,
  Exercise,
  Workout,
  WorkoutLog,
  Screen,
} from "./types";

import {
  demoClients,
  demoExercises,
  demoWorkouts,
  demoWorkoutLogs,
} from "./data/demoData";

import { PTHome } from "./pages/PTHome";
import { CreateClient } from "./pages/CreateClient";
import { ExerciseLibrary } from "./pages/ExerciseLibrary";
import { ClientProfile } from "./pages/ClientProfile";
import { ClientLog } from "./pages/ClientLog";
import { TopBar } from "./components/TopBar";

export default function App() {
  const [screen, setScreen] = useState<Screen>({
    mode: "pt",
    name: "home",
  });

  const [clients, setClients] = useState<Client[]>(demoClients);
  const [exercises, setExercises] = useState<Exercise[]>(demoExercises);
  const [workouts, setWorkouts] = useState<Workout[]>(demoWorkouts);
  const [workoutLogs, setWorkoutLogs] =
    useState<WorkoutLog[]>(demoWorkoutLogs);

  function rid() {
    return Math.random().toString(16).slice(2);
  }

  function createClient(name: string) {
    const client: Client = { id: `c_${rid()}`, name };
    setClients((prev) => [client, ...prev]);
    setScreen({ mode: "pt", name: "client", clientId: client.id });
  }

  function createWorkout(clientId: string) {
    const workout: Workout = {
      id: `w_${rid()}`,
      clientId,
      name: "New Workout",
      items: [],
    };
    setWorkouts((prev) => [...prev, workout]);
    setScreen({
      mode: "pt",
      name: "editWorkout",
      clientId,
      workoutId: workout.id,
    });
  }

  function saveWorkout(updated: Workout) {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === updated.id ? updated : w))
    );
    setScreen({
      mode: "pt",
      name: "client",
      clientId: updated.clientId,
    });
  }

  function saveWorkoutLog(log: WorkoutLog) {
    setWorkoutLogs((prev) => [...prev, log]);
    setScreen({
      mode: "client",
      name: "home",
      clientId: log.clientId,
    });
  }

  const currentClient =
    "clientId" in screen
      ? clients.find((c) => c.id === screen.clientId)
      : undefined;

  const clientWorkouts =
    currentClient
      ? workouts.filter((w) => w.clientId === currentClient.id)
      : [];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <TopBar
        title={screen.mode === "pt" ? "PT" : "Client"}
        rightAction={{
          label: screen.mode === "pt" ? "Client mode" : "PT mode",
          onClick: () =>
            setScreen((prev) => ({
              ...prev,
              mode: prev.mode === "pt" ? "client" : "pt",
            })),
        }}
      />

      {/* PT MODE */}
      {screen.mode === "pt" && screen.name === "home" && (
        <PTHome
          clients={clients}
          onNewClient={() =>
            setScreen({ mode: "pt", name: "home" }) || setScreen({ mode: "pt", name: "home" })
          }
          onGoClient={(id) =>
            setScreen({ mode: "pt", name: "client", clientId: id })
          }
          onGoExerciseLibrary={() =>
            setScreen({ mode: "pt", name: "home" })
          }
        />
      )}

      {/* PT CLIENT */}
      {screen.mode === "pt" &&
        screen.name === "client" &&
        currentClient && (
          <ClientProfile
            client={currentClient}
            workouts={clientWorkouts}
            onNewWorkout={() => createWorkout(currentClient.id)}
            onEditWorkout={(workoutId) =>
              setScreen({
                mode: "pt",
                name: "editWorkout",
                clientId: currentClient.id,
                workoutId,
              })
            }
          />
        )}

      {/* EDIT WORKOUT */}
      {screen.mode === "pt" &&
        screen.name === "editWorkout" &&
        currentClient && (
          <ClientLog
            client={currentClient}
            exercises={exercises}
            workout={
              workouts.find((w) => w.id === screen.workoutId)!
            }
            onSaveWorkout={saveWorkout}
          />
        )}

      {/* CLIENT MODE */}
      {screen.mode === "client" &&
        screen.name === "home" &&
        currentClient && (
          <ClientProfile
            client={currentClient}
            workouts={clientWorkouts}
            onNewWorkout={() => {}}
            onEditWorkout={(workoutId) =>
              setScreen({
                mode: "client",
                name: "workout",
                clientId: currentClient.id,
                workoutId,
              })
            }
          />
        )}

      {screen.mode === "client" &&
        screen.name === "workout" &&
        currentClient && (
          <ClientLog
            client={currentClient}
            exercises={exercises}
            workout={
              workouts.find((w) => w.id === screen.workoutId)!
            }
            onSaveLog={saveWorkoutLog}
          />
        )}
    </div>
  );
}