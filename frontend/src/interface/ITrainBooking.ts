// src/interface/ITrainBooking.ts
import type { Dayjs } from "dayjs";  // ใช้แทน Date เวลา binding กับ antd หรือ form

import type { ITrainerSchedule } from "./ITrainerSchedule";
import type { UsersInterface } from "./IUser";

export interface TrainBookingInterface {
  ID?: number;
  booking_status: string;

  user_id: number;              
  users?: UsersInterface;         

  schedule_id: number;
  schedule?: ITrainerSchedule;

  booking_date: Dayjs | string;
}