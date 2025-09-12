export interface IPersonalTrain {
  ID: number;
  user_id: number;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  goal?: {
    id: number;
    goal: string;
    user_id: number;
    date: string;
    total_calories_per_day: number;
    note: string;
  };
  format: string;
  date: string;
  trainer_id: number;
  trainer_name?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  time: string;
  created_at?: string;
  updated_at?: string;
}
