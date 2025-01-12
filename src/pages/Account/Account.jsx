// import React, { useState } from "react";
// import { Layout, Menu, Avatar, Typography, Divider, Breadcrumb } from "antd";
// import {
//   UserOutlined,
//   ShoppingCartOutlined,
//   FileTextOutlined,
//   LogoutOutlined,
// } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Profile from "../../components/Profile";
// import OrderHistory from "../../components/Order/OrderHistory";
// import Cart from "../Cart/Cart";
// import { logoutCustomer } from "../../redux/auth/auth.slice";

// const { Sider, Content } = Layout;
// const { Title, Text } = Typography;

// const Account = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { userInfo } = useSelector((state) => state.auth);
//   const [selectedKey, setSelectedKey] = useState("profile");

//   const menuItems = [
//     {
//       key: "profile",
//       icon: <UserOutlined />,
//       label: "Hồ sơ",
//     },
//     {
//       key: "orders",
//       icon: <FileTextOutlined />,
//       label: "Đơn hàng",
//     },
//     {
//       key: "cart",
//       icon: <ShoppingCartOutlined />,
//       label: "Giỏ hàng",
//     },
//     {
//       key: "logout",
//       icon: <LogoutOutlined />,
//       label: "Đăng xuất",
//       danger: true,
//     },
//   ];

//   const handleMenuClick = ({ key }) => {
//     if (key === "logout") {
//       dispatch(logoutCustomer());
//       return;
//     }
//     setSelectedKey(key);
//   };

//   const renderContent = () => {
//     switch (selectedKey) {
//       case "profile":
//         return <Profile />;
//       case "cart":
//         return <Cart {...{ isTitle: false }} />;
//       case "orders":
//         return <OrderHistory />;
//       default:
//         return <Profile />;
//     }
//   };

//   return (
//     <>
//       <Breadcrumb
//         className="py-4"
//         items={[{ title: "Trang chủ" }, { title: "Tài khoản" }]}
//       />
//       <Layout className="min-h-screen bg-gray-50 shadow-xl rounded-md mt-2">
//         <Sider
//           width={280}
//           className="hidden md:block bg-white shadow-sm p-4"
//           theme="light"
//         >
//           <div className="text-center mb-6">
//             <Avatar
//               size={80}
//               src={userInfo?.avatar?.url}
//               icon={!userInfo?.avatar?.url && <UserOutlined />}
//               className="mb-3"
//             />
//             <Title level={5} className="mb-0">
//               {userInfo?.name}
//             </Title>
//             <Text type="secondary" className="text-sm">
//               {userInfo?.email}
//             </Text>
//           </div>
//           <Divider />
//           <Menu
//             mode="inline"
//             selectedKeys={[selectedKey]}
//             items={menuItems}
//             onClick={handleMenuClick}
//             className="border-none"
//           />
//         </Sider>
//         <Layout className="p-4 md:p-6 bg-gray-50">
//           <Content className="min-h-[280px]">{renderContent()}</Content>
//         </Layout>
//       </Layout>
//     </>
//   );
// };

// export default Account;

import React, { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Divider,
  Breadcrumb,
  Drawer,
  Button,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  FaUser,
  FaShoppingCart,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import Profile from "../../components/Profile";
import OrderHistory from "../../components/Order/OrderHistory";
import Cart from "../Cart/Cart";
import { logoutCustomer } from "../../redux/auth/auth.slice";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedKey, setSelectedKey] = useState("profile");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    {
      key: "profile",
      icon: <FaUser className="text-lg" />,
      label: "Hồ sơ",
    },
    {
      key: "orders",
      icon: <FaFileAlt className="text-lg" />,
      label: "Đơn hàng",
    },
    {
      key: "cart",
      icon: <FaShoppingCart className="text-lg" />,
      label: "Giỏ hàng",
    },
    {
      key: "logout",
      icon: <FaSignOutAlt className="text-lg" />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      dispatch(logoutCustomer());
      navigate("/");
      return;
    }
    setSelectedKey(key);
    setDrawerOpen(false);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "profile":
        return <Profile />;
      case "cart":
        return <Cart isTitle={false} />;
      case "orders":
        return <OrderHistory />;
      default:
        return <Profile />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6 p-4">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Avatar
            size={96}
            src={userInfo?.avatar?.url}
            icon={!userInfo?.avatar?.url && <FaUser className="text-2xl" />}
            className="shadow-lg border-2 border-gray-100"
          />
        </div>
        <Title level={5} className="mb-1 text-gray-800">
          {userInfo?.name}
        </Title>
        <Text type="secondary" className="text-sm">
          {userInfo?.email}
        </Text>
      </div>
      <Divider className="my-0" />
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        className="border-r-0 flex-1"
      />
    </div>
  );

  return (
    <>
      <Breadcrumb
        className="py-4"
        items={[{ title: "Trang chủ" }, { title: "Tài khoản" }]}
      />

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center mb-4">
        <Button
          type="text"
          icon={<FiMenu className="text-xl" />}
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 hover:bg-gray-100 rounded-lg shadow-sm"
        >
          <span className="font-medium">Menu</span>
        </Button>
      </div>

      <Layout className="min-h-[calc(100vh-120px)] bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Desktop Sidebar */}
        <Sider width={280} className="hidden md:block bg-white" theme="light">
          <SidebarContent />
        </Sider>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <div className="flex justify-between items-center">
              <span>Menu</span>
              <Button
                type="text"
                icon={<FiX className="text-xl" />}
                onClick={() => setDrawerOpen(false)}
              />
            </div>
          }
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={280}
          className="md:hidden p-0"
        >
          <SidebarContent />
        </Drawer>

        {/* Main Content */}
        <Content className="p-4 md:p-6 bg-gray-50">{renderContent()}</Content>
      </Layout>
    </>
  );
};

export default Account;
