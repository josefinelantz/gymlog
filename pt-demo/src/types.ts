export type ViewMode = "trainer" | "client";

export type Trainer = {
  id: string;
  name: string;
};

export type Client = {
  id: string;
  name: string;
  trainerId: string;
};

export type Exercise = {
  id: string;
  name: string;
  notes?: string;
  videoUrl?: string;
  trainerId: string;
  archived?: boolean;
};

export type WorkoutExercise = {
  id: string; // unique row id
  exerciseId: string;
  setsTarget: number;
  repsTarget: number;
};

export type Workout = {
  id: string;
  name: string;
  trainerId: string;
  items: WorkoutExercise[];
};

export type LogEntry = {
  id: string;
  clientId: string;
  workoutId: string;
  exerciseId: string;
  dateISO: string; // YYYY-MM-DD
  sets: number;
  reps: number;
  weightKg: number;
};