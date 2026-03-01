export type Screen =
  | { mode: "pt"; name: "home" }
  | { mode: "pt"; name: "client"; clientId: string }
  | { mode: "pt"; name: "editWorkout"; clientId: string; workoutId: string }
  | { mode: "client"; name: "home"; clientId: string }
  | { mode: "client"; name: "workout"; clientId: string; workoutId: string };

export type Client = {
  id: string;
  name: string;
};

export type Exercise = {
  id: string;
  name: string;
  notes?: string;
};

export type WorkoutItem = {
  id: string;
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  targetWeightKg?: number;
};

export type Workout = {
  id: string;
  clientId: string;
  name: string;
  items: WorkoutItem[];
};

export type WorkoutItemLog = {
  workoutItemId: string;
  actualSets: number;
  actualReps: number;
  actualWeightKg: number;
};

export type WorkoutLog = {
  id: string;
  workoutId: string;
  clientId: string;
  dateISO: string;
  items: WorkoutItemLog[];
};