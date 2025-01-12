import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChartOutlined,
  UsergroupAddOutlined,
  CarryOutOutlined,
  TagsOutlined,
  StarOutlined,
  SettingOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import useScreen from "../../hook/useScreen";
import { logoutAdmin } from "../../redux/auth/auth.slice";
import { useDispatch } from "react-redux";
import HeaderAdmin from "../Header/HeaderAdmin";
import { IoWatchOutline } from "react-icons/io5";
import { TbBrandBooking } from "react-icons/tb";

const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, path) {
  return {
    key,
    icon,
    label,
    path,
  };
}

const items = [
  getItem("Thống kê", "1", <BarChartOutlined />, "/admin/dashboard"),
  getItem("Người dùng", "2", <UsergroupAddOutlined />, "/admin/users"),
  getItem("Đơn hàng", "3", <CarryOutOutlined />, "/admin/orders"),
  getItem("Sản phẩm", "4", <IoWatchOutline />, "/admin/products"),
  getItem("Danh mục", "5", <TagsOutlined />, "/admin/categories"),
  getItem("Thương hiệu", "6", <TbBrandBooking />, "/admin/brands"),
  getItem("Đánh giá", "7", <StarOutlined />, "/admin/reviews"),
  getItem("Liên hệ", "8", <ContactsOutlined />, "/admin/contacts"),
  getItem("Cài đặt", "9", <SettingOutlined />, "/admin/settings"),
];

const LayoutAdmin = ({ children, title = "" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isMobile } = useScreen();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  const handleMenuClick = (item) => {
    const selectedItem = items.find((menuItem) => menuItem.key === item.key);
    if (selectedItem && selectedItem.path) {
      if (selectedItem.path === "/logout") {
        dispatch(logoutAdmin());
        navigate("/admin");
      } else {
        navigate(selectedItem.path);
      }
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {!isMobile && !collapsed && (
          <div className="relative py-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <h1
              className="relative text-4xl font-black text-center uppercase tracking-wider"
              style={{
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent blur-sm">
                Admin
              </span>
              <span className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin
              </span>
            </h1>
            <div className="absolute -left-4 -right-4 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent transform -translate-y-1/2 opacity-20" />
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )}
        <Menu
          className="h-screen"
          theme="dark"
          defaultSelectedKeys={["1"]}
          selectedKeys={[
            items.find((item) => item.path === location.pathname)?.key,
          ]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout className="bg-gradient-to-t from-purple-200 to-purple-100">
        <HeaderAdmin {...{ collapsed, setCollapsed }} />
        <Content style={{ margin: "0 16px" }}>
          <div className="py-4 w-full">
            <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-md">
              <div className="bg-clip-text text-slate-800 font-extrabold text-2xl">
                {title}
              </div>
              {children}
            </div>
          </div>
        </Content>
        <Footer
          className="bg-gradient-to-t from-purple-300 to-purple-200 shadow-lg"
          style={{ textAlign: "center" }}
        >
          <div className="font-medium">
            ADMIN ©{new Date().getFullYear()} Created by KIDYNG WATCH
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
