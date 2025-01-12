import React, { lazy, Suspense } from "react";
import Page from "../components/Layout/Page";
import Loading from "../components/Loading";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthWrapperAdmin = lazy(() =>
  import("../components/Auth/AuthWapperAdmin")
);
const LayoutAdmin = lazy(() => import("../components/Layout/LayoutAdmin"));
const LoginAdmin = lazy(() => import("../pages/LoginAdmin"));
const Dashboard = lazy(() => import("../pages/DashBoard"));
const ManageProduct = lazy(() => import("../pages/ManageProduct"));
const CreateProduct = lazy(() => import("../pages/CreateProduct"));
const ManageUser = lazy(() => import("../pages/ManageUser"));
const ManageOrder = lazy(() => import("../pages/ManageOrder"));
const ManageReview = lazy(() => import("../pages/ManageReview"));
const ManageCategory = lazy(() => import("../pages/ManageCategory"));
const ManageSetting = lazy(() => import("../pages/ManageSetting"));
const ManageContact = lazy(() => import("../pages/ManageContact"));
const ManageBrand = lazy(() => import("../pages/ManageBrand"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticatedAdmin, isLoading } = useSelector(
    (state) => state.auth
  );
  if (!isAuthenticatedAdmin && !isLoading)
    return <Navigate to="/admin" replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticatedAdmin, isLoading } = useSelector(
    (state) => state.auth
  );
  if (isAuthenticatedAdmin && !isLoading)
    return <Navigate to="/admin/dashboard" replace />;
  return children;
};

const LoginWrapper = ({ children, pageTitle }) => (
  <Suspense fallback={<Loading />}>
    <AuthWrapperAdmin>
      <Page title={pageTitle}>{children}</Page>
    </AuthWrapperAdmin>
  </Suspense>
);

const AdminLayoutWrapper = ({ children, pageTitle, layoutTitle }) => (
  <Suspense fallback={<Loading />}>
    <AuthWrapperAdmin>
      <Page title={pageTitle}>
        <LayoutAdmin title={layoutTitle}>
          <ProtectedRoute>{children}</ProtectedRoute>
        </LayoutAdmin>
      </Page>
    </AuthWrapperAdmin>
  </Suspense>
);

const routes = [
  {
    path: "/admin",
    element: (
      <AuthRoute>
        <LoginAdmin />
      </AuthRoute>
    ),
    pageTitle: "SEN AQUATIC | Đăng Nhập Admin",
    wrapper: LoginWrapper,
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
    pageTitle: "SEN AQUATIC | Dashboard",
    layoutTitle: "",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/products",
    element: <ManageProduct />,
    pageTitle: "SEN AQUATIC | Quản lý sản phẩm",
    layoutTitle: "QUẢN LÝ SẢN PHẨM",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/products/create",
    element: <CreateProduct />,
    pageTitle: "SEN AQUATIC | Thêm sản phẩm",
    layoutTitle: "THÊM MỚI SẢN PHẨM",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/users",
    element: <ManageUser />,
    pageTitle: "SEN AQUATIC | Quản lý người dùng",
    layoutTitle: "QUẢN LÝ NGƯỜI DÙNG",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/orders",
    element: <ManageOrder />,
    pageTitle: "SEN AQUATIC | Quản lý đơn hàng",
    layoutTitle: "QUẢN LÝ ĐƠN HÀNG",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/reviews",
    element: <ManageReview />,
    pageTitle: "SEN AQUATIC | Quản lý đánh giá",
    layoutTitle: "QUẢN LÝ ĐÁNH GIÁ",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/categories",
    element: <ManageCategory />,
    pageTitle: "SEN AQUATIC | Quản lý danh mục",
    layoutTitle: "QUẢN LÝ DANH MỤC",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/settings",
    element: <ManageSetting />,
    pageTitle: "SEN AQUATIC | Quản lý cài đặt",
    layoutTitle: "QUẢN LÝ CÀI ĐẶT",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/contacts",
    element: <ManageContact />,
    pageTitle: "SEN AQUATIC | Quản lý liên hệ",
    layoutTitle: "QUẢN LÝ LIÊN HỆ",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/brands",
    element: <ManageBrand />,
    pageTitle: "SEN AQUATIC | Quản lý thương hiệu",
    layoutTitle: "QUẢN LÝ THƯƠNG HIỆU",
    wrapper: AdminLayoutWrapper,
  },
];

const AdminRoutes = routes.map(
  ({ path, element, pageTitle, layoutTitle, wrapper: Wrapper }) => ({
    path,
    element: (
      <Wrapper pageTitle={pageTitle} layoutTitle={layoutTitle}>
        {element}
      </Wrapper>
    ),
  })
);

export default AdminRoutes;
