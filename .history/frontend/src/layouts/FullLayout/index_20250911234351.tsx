// src/layouts/FullLayout.tsx

import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Layout, Menu, Button, message, theme } from "antd";

import {
  UserOutlined,
  HeartOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  DropboxOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  AimOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import logo from "../../assets/gymmy2.png";

const { Header, Content, Footer, Sider } = Layout;

const FullLayout: React.FC = () => {
  const page = localStorage.getItem("page");
  const actor = localStorage.getItem("actor"); // ดึงประเภทผู้ใช้งานจาก localStorage
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("actor"); // ลบ actor เมื่อ logout
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/login";
    }, 1000);
  };

  // กำหนดชุดเมนูตามประเภทผู้ใช้งาน
  let menuItems;
  if (actor === "trainer") {
    menuItems = (
      <>
        <Menu.Item
          key="trainer-dashboard"
          onClick={() => setCurrentPage("trainer-dashboard")}
          style={{ color: "white" }}
        >
          <Link to="/trainer">
            <HomeOutlined />
            <span>หน้าหลักเทรนเนอร์</span>
          </Link>
        </Menu.Item>
        <Menu.Item
          key="create-program"
          onClick={() => setCurrentPage("create-program")}
          style={{ color: "white" }}
        >
          <Link to="/trainer/create-program">
            <AimOutlined />
            <span>สร้างโปรแกรมฝึกส่วนตัว</span>
          </Link>
        </Menu.Item>
        <Menu.Item
          key="trainer-profile"
          onClick={() => setCurrentPage("trainer-profile")}
          style={{ color: "white" }}
        >
          <Link to="/trainer/profile">
            <UserOutlined />
            <span>ข้อมูลส่วนตัว</span>
          </Link>
        </Menu.Item>
      </>
    );
  } else if (actor === "admin") {
    menuItems = (
      <>
        <Menu.Item
          key="manage-schedule"
          onClick={() => setCurrentPage("manage-schedule")}
          style={{ color: "white" }}
        >
          <Link to="/admin/classes">
            <ScheduleOutlined />
            <span>จัดการตารางคลาส</span>
          </Link>
        </Menu.Item>
        <Menu.Item
          key="manage-equipment"
          onClick={() => setCurrentPage("manage-equipment")}
          style={{ color: "white" }}
        >
          <Link to="/admin/equipment">
            <AppstoreOutlined />
            <span>จัดการอุปกรณ์</span>
          </Link>
        </Menu.Item>
        <Menu.Item
          key="user-list"
          onClick={() => setCurrentPage("user-list")}
          style={{ color: "white" }}
        >
          <Link to="/admin/List">
            <TeamOutlined />
            <span>รายชื่อสมาชิกและเทรนเนอร์</span>
          </Link>
        </Menu.Item>
      </>
    );
  } else {
    // เมนูสำหรับลูกค้า (Customer) - เป็นค่า default
    menuItems = (
      <>
        <Menu.Item
          key="dashboard"
          onClick={() => setCurrentPage("dashboard")}
          style={{ color: "white" }}
        >
          <Link to="/">
            <HomeOutlined />
            <span>หน้าหลัก</span>
          </Link>
        </Menu.Item>

        <Menu.Item
          key="booking"
          onClick={() => setCurrentPage("booking")}
          style={{ color: "white" }}
        >
          <Link to="/booking">
            <CalendarOutlined />
            <span>หน้าจองคลาส</span>
          </Link>
        </Menu.Item>
        
        <Menu.Item
          key="trainerbooking"
          onClick={() => setCurrentPage("trainerbooking")}
          style={{ color: "white" }}
        >
          <Link to="/trainerbooking">
            <CalendarOutlined />
            <span>จองเทรนเนอร์</span>
          </Link>
        </Menu.Item>

        <Menu.SubMenu
          key="health"
          title={
            <div style={{ color: "white" }}>
              <HeartOutlined />
              <span>สุขภาพ</span>
            </div>
          }
        >
          <Menu.Item key="Helth" style={{ color: "white" }}>
            <Link to="/health/Health">
              <MedicineBoxOutlined />
              <span>บันทึกสุขภาพ</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="Nutrition" style={{ color: "white" }}>
            <Link to="/health/nutrition">
              <CalendarOutlined />
              <span>โภชนาการ</span>
            </Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          key="group"
          onClick={() => setCurrentPage("group")}
          style={{ color: "white" }}
        >
          <Link to="/group">
            <UsergroupAddOutlined />
            <span>หน้ากลุ่มออกกำลังกาย</span>
          </Link>
        </Menu.Item>

        <Menu.Item
          key="package"
          onClick={() => setCurrentPage("package")}
          style={{ color: "white" }}
        >
          <Link to="/packages">
            <DropboxOutlined />
            <span>หน้าของแพ็กเกจ</span>
          </Link>
        </Menu.Item>

        <Menu.Item
          key="customer"
          onClick={() => setCurrentPage("customer")}
          style={{ color: "white" }}
        >
          <Link to="/customer">
            <UserOutlined />
            <span>โปรไฟล์</span>
          </Link>
        </Menu.Item>
      </>
    );
  }

  return (
    <Layout>
      {contextHolder}
      <Sider
        style={{
          backgroundColor: "#C50000",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={200}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "20px 0",
                padding: "0 16px",
              }}
            >
              <img src={logo} alt="Logo" style={{ width: "100%" }} />
            </div>

            <Menu
              style={{ backgroundColor: "#C50000" }}
              defaultSelectedKeys={[page ? page : "dashboard"]}
              mode="inline"
            >
              {menuItems}
            </Menu>
          </div>

          <Button onClick={Logout} style={{ margin: 4 }}>
            {collapsed ? "ออก" : "ออกจากระบบ"}
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px", flexGrow: 1 }}>
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Gymmy Healthy Fitness Club
        </Footer>
      </Layout>
    </Layout>
  );
};

export default FullLayout;