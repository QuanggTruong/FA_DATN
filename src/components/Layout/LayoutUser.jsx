import React, { useEffect } from "react";
import HeaderCustomer from "../Header/HeaderCustomer";
import { useLocation } from "react-router-dom";
import FooterCustomer from "../Footer/FooterCustomer";

const LayoutUser = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <HeaderCustomer />
      <div className="px-4 lg:px-16 py-6 mb-8 min-h-screen" style={{ backgroundColor: '#a0a1a3' }}>{children}</div>
      <FooterCustomer />
    </div>
  );
};

export default LayoutUser;
