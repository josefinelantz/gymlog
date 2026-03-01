import type { Client, Exercise, LogEntry, Trainer, Workout } from "../types";

export const demoTrainer: Trainer = {
  id: "t1",
  name: "Alex PT",
};

export const demoClient: Client = {
  id: "c1",
  name: "Anna",
  trainerId: demoTrainer.id,
};

export const demoExercises: Exercise[] = [
  {
    id: "e1",
    trainerId: demoTrainer.id,
    name: "Squat",
    notes: "Focus on depth & bracing.",
    videoUrl: "https://www.youtube.com/watch?v=SW_C1A-rejs",
  },
  {
    id: "e2",
    trainerId: demoTrainer.id,
    name: "Bench Press",
    notes: "Shoulder blades back and down.",
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
  },
];

export const demoWorkout: Workout = {
  id: "w1",
  name: "Lower Body",
  trainerId: demoTrainer.id,
  items: [
    {
      id: "we1",
      exerciseId: "e1",
      setsTarget: 3,
      repsTarget: 8,
    },
  ],
};

export const demoLogs: LogEntry[] = [
  {
    id: "l1",
    clientId: demoClient.id,
    workoutId: demoWorkout.id,
    exerciseId: "e1",
    dateISO: isoDaysAgo(10),
    sets: 3,
    reps: 8,
    weightKg: 40,
  },
  {
    id: "l2",
    clientId: demoClient.id,
    workoutId: demoWorkout.id,
    exerciseId: "e1",
    dateISO: isoDaysAgo(3),
    sets: 3,
    reps: 8,
    weightKg: 45,
  },
];

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}