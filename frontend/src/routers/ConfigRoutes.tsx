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
import Booking from "../pages/classbooking/classHome";
import TrainerBooking from "../pages/trainer/trainer/trainerbooking"
import Health from "../pages/health/Health/HealthHome";
import Activity from "../pages/health/Activity/ActivityHome";
import Group from "../pages/group/groupHome";
import Package from "../pages/package/packageHome";
import Customer from "../pages/customer";
import CustomerCreate from "../pages/admin/List/create";
import CustomerEdit from "../pages/admin/List/edit";

// Routes สำหรับเทรนเนอร์ (Trainer)
import TrainerDashboard from "../pages/trainer/Actor/trainerHome";
import CreateProgram from "../pages/trainer/Actor/personal-training/personalHome";
import TrainerProfile from "../pages/trainer/Actor/trainerProfile";

// Routes สำหรับแอดมิน (Admin)
import ManageSchedule from "../pages/admin/class-activity/class-activityHome";
import ManageEquipment from "../pages/admin/equipment/equipmentHome";
import UserList from "../pages/admin/List/userlist";


const ConfigRoutes: React.FC = () => {
  return (
    <Routes>
      {/* หน้า login / signup ใช้งาน MinimalLayout */}
      <Route element={<MinimalLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      {/* หน้าที่ต้องป้องกัน (ต้อง Login) ใช้งาน FullLayout */}
      <Route element={<PrivateRoute><FullLayout /></PrivateRoute>}>
        {/* --- Routes สำหรับลูกค้า (Customer) --- */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/trainerbooking" element={<TrainerBooking />} />
        <Route path="/health" element={<Health />} />
        <Route path="/health/Health" element={<Health />} />
        <Route path="/health/Activity" element={<Activity />} />
        <Route path="/group" element={<Group />} />
        <Route path="/package" element={<Package />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer/create" element={<CustomerCreate />} />
        <Route path="/customer/edit/:id" element={<CustomerEdit />} />

        {/* --- Routes สำหรับเทรนเนอร์ (Trainer) --- */}
        <Route path="/trainer" element={<TrainerDashboard />} />
        <Route path="/trainer/create-program" element={<CreateProgram />} />
        <Route path="/trainer/profile" element={<TrainerProfile />} />
        
        {/* --- Routes สำหรับแอดมิน (Admin) --- */}
        <Route path="/admin/schedule" element={<ManageSchedule />} />
        <Route path="/admin/equipment" element={<ManageEquipment />} />
        <Route path="/admin/List" element={<UserList />} />
      </Route>

      {/* Redirect ไปหน้า login ถ้าเข้า path ที่ไม่ถูกต้อง */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default ConfigRoutes;
