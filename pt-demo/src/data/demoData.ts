import type { Client, Exercise, Workout, WorkoutLog } from "../types";

export const demoClients: Client[] = [
  { id: "c1", name: "Anna" },
];

export const demoExercises: Exercise[] = [
  { id: "e1", name: "Squat" },
  { id: "e2", name: "Bench Press" },
];

export const demoWorkouts: Workout[] = [
  {
    id: "w1",
    clientId: "c1",
    name: "Lower Body",
    items: [
      {
        id: "wi1",
        exerciseId: "e1",
        targetSets: 3,
        targetReps: 8,
        targetWeightKg: 40,
      },
    ],
  },
];

export const demoWorkoutLogs: WorkoutLog[] = [
  {
    id: "log1",
    workoutId: "w1",
    clientId: "c1",
    dateISO: isoDaysAgo(7),
    items: [
      {
        workoutItemId: "wi1",
        actualSets: 3,
        actualReps: 8,
        actualWeightKg: 45,
      },
    ],
  },
];

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}