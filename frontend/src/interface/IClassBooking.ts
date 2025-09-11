// src/interface/IClassBooking.ts
import type { UsersInterface } from "./IUser";
import type { ClassActivity } from "../types";

export interface IClassBooking {
  ID?: number;
  status: string;

  user_id: number;
  user?: UsersInterface;

  class_activity_id: number;
  class_activity?: ClassActivity;
}


