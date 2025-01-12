import React, { lazy, Suspense } from "react";
import Page from "../components/Layout/Page";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const LayoutUser = lazy(() => import("../components/Layout/LayoutUser"));
const AuthWrapper = lazy(() => import("../components/Auth/AuthWapper"));
const HomePage = lazy(() => import("../pages/HomePage"));
const Detail = lazy(() => import("../pages/Detail"));
const Cart = lazy(() => import("../pages/Cart"));
const Account = lazy(() => import("../pages/Account"));
const Category = lazy(() => import("../pages/Category"));
const OrderReturn = lazy(() => import("../pages/OrderReturn"));
const Auth = lazy(() => import("../pages/Auth"));
const Contact = lazy(() => import("../pages/Contact"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const Brand = lazy(() => import("../pages/Brand"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  if (!isAuthenticated && !isLoading) return <Navigate to="/auth" replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  if (isAuthenticated && !isLoading) return <Navigate to="/" replace />;
  return children;
};

const LayoutWrapper = ({ children, title }) => (
  <Suspense fallback={<Loading />}>
    <AuthWrapper>
      <LayoutUser>
        <Page title={title}>{children}</Page>
      </LayoutUser>
    </AuthWrapper>
  </Suspense>
);

const routes = [
  {
    path: "/",
    element: <HomePage />,
    title: "SEN AQUATIC - Hệ thống phân phối đồng hồ chính hãng",
  },
  {
    path: "/auth",
    element: (
      <AuthRoute>
        <Auth />
      </AuthRoute>
    ),
    title: "SEN AQUATIC",
  },
  {
    path: "/detail/:slug",
    element: <Detail />,
    title: "SEN AQUATIC - Chi Tiết Sản Phẩm",
  },
  {
    path: "/cart",
    element: <Cart />,
    title: "SEN AQUATIC - Giỏ Hàng",
  },
  {
    path: "/account",
    element: (
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    ),
    title: "SEN AQUATIC - Tài Khoản",
  },
  {
    path: "/category/:slug",
    element: <Category />,
    title: "SEN AQUATIC - Danh Mục Sản Phẩm",
  },
  {
    path: "/order-return",
    element: (
      <ProtectedRoute>
        <OrderReturn />
      </ProtectedRoute>
    ),
    title: "SEN AQUATIC - Thông báo đặt hàng",
  },
  {
    path: "/contact",
    element: <Contact />,
    title: "SEN AQUATIC - Liên hệ",
  },
  {
    path: "/about-us",
    element: <AboutUs />,
    title: "SEN AQUATIC - Giới thiệu",
  },
  {
    path: "/brands/:slug",
    element: <Brand />,
    title: "SEN AQUATIC - Thương hiệu",
  },
];

const CustomerRoutes = routes.map(({ path, element, title }) => ({
  path,
  element: <LayoutWrapper title={title}>{element}</LayoutWrapper>,
}));

export default CustomerRoutes;
