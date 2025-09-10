// ================= Imports =================
import axios, { type AxiosRequestConfig } from "axios";

import type { UsersInterface } from "../../interface/IUser";
import type { SignInInterface } from "../../interface/SignIn";
import type { NutritionData } from "../../interface/Nutrition";
import type { TrainerInterface } from "../../interface/ITrainer";
import type { ITrainerSchedule } from "../../interface/ITrainerSchedule";
import type { TrainBookingInterface } from "../../interface/ITrainBooking";

// ================= Config =================
const apiUrl = "http://localhost:8000";

function authConfig(): AxiosRequestConfig {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

// ================= Auth & User APIs =================
async function SignIn(data: SignInInterface) {
  try {
    return await axios.post(`${apiUrl}/signin`, data);
  } catch (e: any) {
    return e.response;
  }
}

async function GetGender() {
  try {
    return await axios.get(`${apiUrl}/genders`);
  } catch (e: any) {
    return e.response;
  }
}

async function GetUsers() {
  try {
    return await axios.get(`${apiUrl}/api/users`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetUsersById(id: string) {
  try {
    return await axios.get(`${apiUrl}/api/user/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function UpdateUsersById(id: string, data: UsersInterface) {
  try {
    return await axios.put(`${apiUrl}/api/user/${id}`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function DeleteUsersById(id: string) {
  try {
    return await axios.delete(`${apiUrl}/api/user/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function CreateUser(data: UsersInterface) {
  try {
    return await axios.post(`${apiUrl}/signup`, data);
  } catch (e: any) {
    return e.response;
  }
}

// ================= Trainer APIs =================
async function CreateTrainer(data: TrainerInterface) {
  try {
    return await axios.post(`${apiUrl}/api/trainers`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetTrainers() {
  try {
    return await axios.get(`${apiUrl}/api/trainers`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetTrainerById(id: number) {
  try {
    return await axios.get(`${apiUrl}/api/trainers/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function UpdateTrainerById(id: number, data: TrainerInterface) {
  try {
    return await axios.put(`${apiUrl}/api/trainers/${id}`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function DeleteTrainerById(id: number) {
  try {
    return await axios.delete(`${apiUrl}/api/trainers/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ================= Trainer Schedule APIs =================
async function CreateTrainerSchedule(data: ITrainerSchedule) {
  try {
    return await axios.post(`${apiUrl}/api/trainer-schedules`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetTrainerSchedules() {
  try {
    return await axios.get(`${apiUrl}/api/trainer-schedules`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetTrainerScheduleById(id: number) {
  try {
    return await axios.get(`${apiUrl}/api/trainer-schedules/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function UpdateTrainerScheduleById(id: number, data: ITrainerSchedule) {
  try {
    return await axios.put(`${apiUrl}/api/trainer-schedules/${id}`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function DeleteTrainerScheduleById(id: number) {
  try {
    return await axios.delete(`${apiUrl}/api/trainer-schedules/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetTrainerSchedulesByDate(trainerId: number, dateStr: string) {
  try {
    return await axios.get(`${apiUrl}/api/trainers/schedules/${trainerId}`, {
      params: { date: dateStr },
      ...authConfig(),
    });
  } catch (e: any) {
    return e.response;
  }
}

async function GetTrainerSchedulesByTrainer(trainerID: number) {
  try {
    return await axios.get(`${apiUrl}/api/trainer-schedules/allschedules/${trainerID}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ================= Booking APIs =================
async function BookTrainerSchedule(schedule_id: number, user_id: number) {
  try {
    return await axios.post(
      `${apiUrl}/api/train-bookings`,
      {
        schedule_id,
        user_id,
        booking_status: "Booked",
        booking_date: new Date().toISOString(),
      },
      authConfig()
    );
  } catch (e: any) {
    return e.response;
  }
}

async function CancelTrainBooking(bookingId: number) {
  try {
    return await axios.delete(`${apiUrl}/api/train-bookings/${bookingId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetBookingsByUserId(userId: number) {
  try {
    return await axios.get<TrainBookingInterface[]>(`${apiUrl}/api/train-bookings/user/${userId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}


// ================= Nutrition APIs =================
async function GetNutrition(date?: string) {
  try {
    const q = date ? `?date=${encodeURIComponent(date)}` : "";
    return await axios.get(`${apiUrl}/api/nutrition${q}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function UpsertNutrition(data: any) {
  try {
    return await axios.post(`${apiUrl}/api/nutrition`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

export async function getNutrition(date?: string) {
  try {
    const url = date ? `${apiUrl}/api/nutrition?date=${date}` : `${apiUrl}/api/nutrition`;
    return await axios.get(url, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

export async function upsertNutrition(payload: NutritionData) {
  try {
    return await axios.post(`${apiUrl}/api/nutrition`, payload, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ================= File Upload APIs =================
export async function UploadTrainerImage(id: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return await axios.post(`${apiUrl}/api/trainers/${id}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authConfig().headers,
    },
  });
}

async function UploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return await axios.post(`${apiUrl}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// ================= Exports =================
export {
  // Users
  SignIn,
  GetGender,
  GetUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,

  // Trainers
  CreateTrainer,
  GetTrainers,
  GetTrainerById,
  UpdateTrainerById,
  DeleteTrainerById,

  // Trainer Schedules
  CreateTrainerSchedule,
  GetTrainerSchedules,
  GetTrainerScheduleById,
  UpdateTrainerScheduleById,
  DeleteTrainerScheduleById,
  GetTrainerSchedulesByDate,
  GetTrainerSchedulesByTrainer,

  // Booking
  BookTrainerSchedule,
  CancelTrainBooking,
  GetBookingsByUserId,

  // Nutrition
  GetNutrition,
  UpsertNutrition,

  // Uploads
  UploadImage,
};
