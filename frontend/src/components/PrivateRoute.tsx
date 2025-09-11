import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  const isLogin = localStorage.getItem("isLogin");
  
  // ตรวจสอบทั้ง token และ isLogin flag
  if (token && isLogin === "true") {
    return children;
  }
  
  // ถ้าไม่มี token หรือ isLogin ไม่ใช่ true ให้ redirect ไป login
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
