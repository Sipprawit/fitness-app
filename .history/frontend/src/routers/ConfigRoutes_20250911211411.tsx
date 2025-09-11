// src/routers/ConfigRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MinimalLayout from "../layouts/MinimalLayout";
import FullLayout from "../layouts/FullLayout";
import PrivateRoute from "../components/PrivateRoute";
import LoginPage from "../pages/auth/Login";
import SignUpPage from "../pages/auth/Register";

// Routes สำหรับลูกค้า (Customer)
import Dashboard from "../pages/dashboard";
import Booking from "../pages/classbooking/ClassHome";
import BookClass from "../pages/classbooking/BookClass";
import TrainerBooking from "../pages/trainer/trainer/trainerbooking"
import HealthHome from "../pages/health/Health/healthHome";
import Nutrition from "../pages/health/nutrition/nutritionHome";

import Group from "../pages/group/groupHome";
import Package from "../pages/package/packageHome";
import Customer from "../pages/customer";
import CustomerCreate from "../pages/admin/List/create";
import CustomerEdit from "../pages/admin/List/edit";

// Routes สำหรับเทรนเนอร์ (Trainer)
import TrainerDashboard from "../pages/trainer/Actor/trainerHome";
import CreateProgram from "../pages/trainer/Actor/personal-training/personalHome";
import TrainerProfile from "../pages/trainer/Actor/trainerProfile";
import AddTrainer from "../pages/trainer/Actor/addTrainer";
import EditTrainer from "../pages/trainer/Actor/editTrainer";
import AddTrainerSchedule from "../pages/trainer/Actor/addTrainerSchedule";
import TrainerDetail from "../pages/trainer/trainer/trainerDetail";
import BookTrainSchedule from "../pages/trainer/trainer/BookTrainSchedule";
import BookTrainHistory from "../pages/trainer/trainer/BookTrainHistory";

// Routes สำหรับแอดมิน (Admin)
import ManageSchedule from "../pages/admin/ClassActivity/ClassActivityListPage";
import ClassForm from "../pages/admin/ClassActivity/ClassActivityFormPage";
import ClassDelete from "../pages/admin/ClassActivity/ClassActivityDeletePage";
import ManageEquipment from "../pages/admin/EquipmentFacility/EquipmentFacilityPage";
import EquipmentFacilityForm from "../pages/admin/EquipmentFacility/EquipmentFacilityFormPage";
import EquipmentFacilityDelete from "../pages/admin/EquipmentFacility/EquipmentFacilityDeletePage";
import UserList from "../pages/admin/List/userlist";
import UserDeletePage from "../pages/admin/List/UserDeletePage";
import TrainerDeletePage from "../pages/admin/List/TrainerDeletePage";
import AdminClassDetailPage from "../pages/admin/ClassActivity/ClassDetailPage";
import MemberClassDetailPage from "../pages/classbooking/ClassDetailPage";
import { HealthActivityProvider } from "../contexts/HealthContext";
import { NutritionProvider } from "../contexts/NutritionContext";



const ConfigRoutes: React.FC = () => {
    return (
        <Routes>
            {/* หน้า login / signup ใช้งาน MinimalLayout */}
            <Route element={<MinimalLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Route>

      {/* หน้าที่ต้องป้องกัน (ต้อง Login) ใช้งาน FullLayout */}
      <Route
        element={
          <PrivateRoute>
            <FullLayout />
          </PrivateRoute>
        }
      >
        {/* --- Routes สำหรับลูกค้า (Customer) --- */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/class" element={<Booking />} />
        <Route path="/class/booking-history" element={<BookClass />} />
        <Route path="/trainerbooking" element={<TrainerBooking />} />
        <Route path="/health/Health" element={
          <HealthActivityProvider>
            <HealthHome />
          </HealthActivityProvider>
        } />
        <Route path="/health/nutrition" element={
          <HealthActivityProvider>
            <NutritionProvider>
              <Nutrition />
            </NutritionProvider>
          </HealthActivityProvider>
        } />
        <Route path="/group" element={<Group />} />
        <Route path="/package" element={<Package />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer/create" element={<CustomerCreate />} />
        <Route path="/customer/edit/:id" element={<CustomerEdit />} />
        <Route path="/trainers/:id" element={<TrainerDetail />} />
        <Route path="/trainers/:id/train-bookings" element={<BookTrainSchedule />} />
        <Route path="/trainer-booking-history" element={<BookTrainHistory />} />

        {/* --- Routes สำหรับเทรนเนอร์ (Trainer) --- */}
        <Route path="/trainer" element={<TrainerDashboard />} />
        <Route path="/trainer/create-program" element={<CreateProgram />} />
        <Route path="/trainer/profile" element={<TrainerProfile />} />
        <Route path="/trainer/profile/addTrainer" element={<AddTrainer />} />
        <Route path="/trainer/edit/:id" element={<EditTrainer />} />
        <Route
          path="/trainer/:id/schedule/addTrainerSchedule"
          element={<AddTrainerSchedule />}
        />

        {/* --- Routes สำหรับแอดมิน (Admin) --- */}
                <Route path="/admin/classes" element={<ManageSchedule />} />
                <Route path="/admin/class/detail/:id" element={<AdminClassDetailPage />} />
                
                {/* --- เพิ่ม Route สำหรับหน้ารายละเอียดคลาส --- */}
                <Route path="/class/detail/:id" element={<MemberClassDetailPage />} />
                
                <Route path="/class/add" element={<ClassForm />} />
                <Route path="/class/edit/:id" element={<ClassForm />} />
                <Route path="/class/delete/:id" element={<ClassDelete />} />

                <Route path="/admin/equipment" element={<ManageEquipment />} />
                {/* Equipment CRUD */}
                <Route path="/equipment/add" element={<EquipmentFacilityForm itemType="equipment" />} />
                <Route path="/equipment/edit/:id" element={<EquipmentFacilityForm itemType="equipment" />} />
                <Route path="/equipment/delete/:id" element={<EquipmentFacilityDelete itemType="equipment" />} />
                {/* Facility CRUD */}
                <Route path="/facility/add" element={<EquipmentFacilityForm itemType="facility" />} />
                <Route path="/facility/edit/:id" element={<EquipmentFacilityForm itemType="facility" />} />
                <Route path="/facility/delete/:id" element={<EquipmentFacilityDelete itemType="facility" />} />
                <Route path="/admin/List" element={<UserList />} />
                <Route path="/user/delete/:id" element={<UserDeletePage />} />
                <Route path="/trainer/delete/:id" element={<TrainerDeletePage />} />
            </Route>

            {/* Redirect ไปหน้า login ถ้าเข้า path ที่ไม่ถูกต้อง */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default ConfigRoutes;