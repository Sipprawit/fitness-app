// ================= Imports =================
import axios, { type AxiosRequestConfig } from "axios";

import type { UsersInterface } from "../../interface/IUser";
import type { SignInInterface } from "../../interface/SignIn";
import type { NutritionData } from "../../interface/Nutrition";
import type { TrainerInterface } from "../../interface/ITrainer";
import type { ITrainerSchedule } from "../../interface/ITrainerSchedule";
import type { TrainBookingInterface } from "../../interface/ITrainBooking";
import type { IClassBooking } from "../../interface/IClassBooking";

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

// ================= Class Booking APIs =================
async function BookClass(class_activity_id: number, user_id: number, status: string = "Confirmed") {
  try {
    return await axios.post< IClassBooking >(
      `${apiUrl}/api/class-bookings`,
      { class_activity_id, user_id, status },
      authConfig()
    );
  } catch (e: any) {
    return e.response;
  }
}

async function CancelClassBooking(bookingId: number) {
  try {
    return await axios.delete(`${apiUrl}/api/class-bookings/${bookingId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetUserClassBooking(userId: number, classId: number) {
  try {
    return await axios.get(`${apiUrl}/api/class-bookings/user/${userId}/class/${classId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetUserBookings(userId: number) {
  try {
    return await axios.get(`${apiUrl}/api/class-bookings/user/${userId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// Get user's booked classes with class details
async function GetUserBookedClasses(userId: number) {
  try {
    return await axios.get(`${apiUrl}/api/class-bookings/user/${userId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// Get user's booked trainers with trainer details
async function GetUserBookedTrainers(userId: number) {
  try {
    return await axios.get(`${apiUrl}/api/train-bookings/user/${userId}`, authConfig());
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

// ================= Class Activities APIs =================
async function GetAllClasses() {
  try {
    return await axios.get(`${apiUrl}/api/classes`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetClassById(id: number) {
  try {
    return await axios.get(`${apiUrl}/api/classes/${id}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetClassReviews(classId: number) {
  try {
    return await axios.get(`${apiUrl}/api/classes/${classId}/reviews`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ================= Group APIs =================
async function GetGroups() {
  try {
    return await axios.get(`${apiUrl}/api/groups`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function CreateGroup(data: any) {
  try {
    return await axios.post(`${apiUrl}/api/groups`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function JoinGroup(groupId: number) {
  try {
    return await axios.post(`${apiUrl}/api/group/${groupId}/join`, {}, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function LeaveGroup(groupId: number) {
  try {
    return await axios.delete(`${apiUrl}/api/group/${groupId}/leave`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function DeleteGroup(groupId: number) {
  try {
    return await axios.delete(`${apiUrl}/api/group/${groupId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

// ================= Review APIs =================
async function CreateReview(data: any) {
  try {
    return await axios.post(`${apiUrl}/api/reviews`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function UpdateReview(reviewId: number, data: any) {
  try {
    return await axios.put(`${apiUrl}/api/reviews/${reviewId}`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function DeleteReview(reviewId: number) {
  try {
    return await axios.delete(`${apiUrl}/api/reviews/${reviewId}`, authConfig());
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

async function GetPackages() {
  try {
    return await axios.get(`${apiUrl}/api/packages`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function GetServices() {
  try {
    console.log('GetServices - calling API:', `${apiUrl}/api/services`);
    const response = await axios.get(`${apiUrl}/api/services`, authConfig());
    console.log('GetServices - response:', response);
    return response;
  } catch (e: any) {
    console.log('GetServices - error:', e);
    return e.response;
  }
}

async function GetUserPackageStatus(userId: number) {
  try {
    return await axios.get(`${apiUrl}/api/package-members/user/${userId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function CreatePackageMember(data: { user_id: number; package_id: number }) {
  try {
    return await axios.post(`${apiUrl}/api/package-members`, data, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function DeleteUserPackage(userId: number) {
  try {
    return await axios.delete(`${apiUrl}/api/package-members/user/${userId}`, authConfig());
  } catch (e: any) {
    return e.response;
  }
}

async function UpdateUserPackage(userId: number, packageId: number) {
  try {
    return await axios.put(`${apiUrl}/api/package-members/user/${userId}`, { package_id: packageId }, authConfig());
  } catch (e: any) {
    return e.response;
  }
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

  // Class Booking
  BookClass,
  CancelClassBooking,
  GetUserClassBooking,
  GetUserBookings,
  GetUserBookedClasses,
  GetUserBookedTrainers,

  // Class Activities
  GetAllClasses,
  GetClassById,
  GetClassReviews,

  // Groups
  GetGroups,
  CreateGroup,
  JoinGroup,
  LeaveGroup,
  DeleteGroup,

  // Reviews
  CreateReview,
  UpdateReview,
  DeleteReview,

  // Nutrition
  GetNutrition,
  UpsertNutrition,

  // Package & Services
  GetPackages,
  GetServices,
  GetUserPackageStatus,
  CreatePackageMember,
  DeleteUserPackage,
  UpdateUserPackage,

  // Uploads
  UploadImage,
};
