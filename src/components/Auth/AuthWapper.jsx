import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountCustomer } from "../../redux/auth/auth.thunk";
import { set } from "../../storage/storage";
import Loading from "../Loading";
import { useLocation } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const { pathname } = useLocation();
  const token = urlParams.get("token");

  const initAuth = () => {
    if (token) {
      set("ACCESS_TOKEN", token);
      window.location.href = "/";
    }
    dispatch(getAccountCustomer());
    setIsInitialized(true);
  };

  useEffect(() => {
    initAuth();
  }, [dispatch]);

  if ((!isInitialized || isLoading) && pathname !== "/auth") {
    return <Loading />;
  }

  return children;
};

export default AuthWrapper;
