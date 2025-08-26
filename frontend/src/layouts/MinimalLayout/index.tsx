import React from "react";
import { Outlet } from "react-router-dom";

const MinimalLayout: React.FC = () => {
  return (
    <div>
      {/* ออกแบบ Layout สำหรับหน้า login */}
      <Outlet />
    </div>
  );
};

export default MinimalLayout;
