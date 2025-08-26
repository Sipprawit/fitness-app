import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token"); // ตรวจสอบ token ที่ login เซฟไว้
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
