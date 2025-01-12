import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountAdmin } from "../../redux/auth/auth.thunk";
import Loading from "../Loading";
import { useLocation } from "react-router-dom";
import { get } from "../../storage/storage";

const AuthWrapperAdmin = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticatedAdmin } = useSelector(
    (state) => state.auth
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const { pathname } = useLocation();

  const initAuth = () => {
    const accessToken = get("ACCESS_TOKEN_ADMIN");
    if (accessToken && !isAuthenticatedAdmin) {
      dispatch(getAccountAdmin()).then(() => {
        setIsInitialized(true);
      });
    } else {
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    initAuth();
  }, [isAuthenticatedAdmin]);

  if ((!isInitialized || isLoading) && pathname !== "/admin") {
    return <Loading />;
  }

  return children;
};

export default AuthWrapperAdmin;