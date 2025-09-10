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
import ManageSchedule from "../pages/admin/ClassActivity/ClassActivityListPage";
import ClassForm from "../pages/admin/ClassActivity/ClassActivityFormPage";
import ClassDelete from "../pages/admin/ClassActivity/ClassActivityDeletePage";
import ManageEquipment from "../pages/admin/EquipmentFacility/EquipmentFacilityPage";
import EquipmentFacilityForm from "../pages/admin/EquipmentFacility/EquipmentFacilityFormPage";
import EquipmentFacilityDelete from "../pages/admin/EquipmentFacility/EquipmentFacilityDeletePage";
import UserList from "../pages/admin/List/userlist";
import ClassDetailPage from "../pages/admin/ClassActivity/ClassDetailPage";


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
                
                {/* --- เพิ่ม Route สำหรับหน้ารายละเอียดคลาส --- */}
                <Route path="/class/detail/:id" element={<ClassDetailPage />} />
                
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
            </Route>

            {/* Redirect ไปหน้า login ถ้าเข้า path ที่ไม่ถูกต้อง */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default ConfigRoutes;