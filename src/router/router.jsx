  import React from "react";
  import { Route, Routes } from "react-router-dom";
  import CustomerRoutes from "./customer";
  import AdminRoutes from "./admin";
  import NotFound from "../pages/NotFound";

  const Router = () => {
    return (
      <Routes>
        {CustomerRoutes.map((route, index) => (
          <Route
            key={`customer-${index}`}
            path={route.path}
            element={route.element}
          />
        ))}
        {AdminRoutes.map((route, index) => (
          <Route
            key={`admin-${index}`}
            path={route.path}
            element={route.element}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  };

  export default Router;
