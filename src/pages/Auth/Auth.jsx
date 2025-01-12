import React, { useEffect, useState } from "react";
import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";
import ResetPassword from "../../components/Auth/ResetPassword";
import SendOtp from "../../components/Auth/SendOtp";
import Verify from "../../components/Auth/Verify";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [step, setStep] = useState("login");
  const [isReset, setIsReset] = useState(false);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const page = searchParams.get("page");
  const registered = searchParams.get("error");

  useEffect(() => {
    if (registered && registered === "already_registered") {
      message.error("Tài khoản đã tồn tại vui lòng thử lại");
      navigate("/auth");
    }
  }, []);

  useEffect(() => {
    if (page && page === "register") setStep("register");
  }, [page, searchParams]);

  const renderStep = () => {
    switch (step) {
      case "login":
        return <Login {...{ setStep }} />;
      case "register":
        return <Register {...{ setStep }} />;
      case "resetPassword":
        return <ResetPassword {...{ setStep, setIsReset }} />;
      case "sendOtp":
        return <SendOtp {...{ setStep, setIsReset }} />;
      case "verify":
        return <Verify {...{ setStep, isReset }} />;
      default:
        return <Login {...{ setStep }} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full flex items-center justify-center px-4 sm:px-6 mt-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8">
          <div className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
