import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateForm, validateLoginSchema } from "../../validate/validate";
import ErrorValidate from "../Notification/ErrorValidate";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { loginCustomer, sendOtp } from "../../redux/auth/auth.thunk";
import { set } from "../../storage/storage";
import { setEmailVerify } from "../../redux/auth/auth.slice";
import Cookies from "js-cookie";

const STYLE_INPUT =
  "mt-1 p-2 w-full border rounded-md bg-transparent text-gray-700 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300";
const STYLE_LABEL = "block text-sm font-medium text-gray-700";
const BE_URL = import.meta.env.VITE_APP_API_GOOGLE;

const Login = ({ setStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: Cookies.get("email") || "",
    password: Cookies.get("password") || "",
  });
  const [validates, setValidates] = useState({});
  const [isRemember, setIsRemember] = useState(false);

  const handleChangeInput = (key, value) => {
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLoginGoogle = () => {
    window.location.href = BE_URL + "/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validateForm({
      input,
      validateSchema: validateLoginSchema,
    });
    if (Object.keys(validationErrors).length > 0)
    {
      setValidates(validationErrors);
      return;
    }
    dispatch(loginCustomer(input)).then((res) => {
      const data = res.payload;
      if (res.payload.success) {
        if (isRemember) {
          Cookies.set("email", input.email, { expires: 30 });
          Cookies.set("password", input.password, { expires: 30 });
        }
        set("ACCESS_TOKEN", data.accessToken);
        message.success("Đăng nhập thành công");
        navigate("/");
        return;
      }
      if (data?.data?.verify === false) {
        dispatch(setEmailVerify(data?.data?.email));
        dispatch(sendOtp({ email: data?.data?.email }));
        setStep("verify");
        return;
      }
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-xl font-bold text-center">ĐĂNG NHẬP</div>
      <div>
        <label className={STYLE_LABEL}>Email:</label>
        <input
          value={input.email}
          onFocus={() => setValidates((prev) => ({ ...prev, email: "" }))}
          onChange={(e) => handleChangeInput("email", e.target.value)}
          type="email"
          className={`${STYLE_INPUT} ${
            validates.email ? "border-red-500" : ""
          }`}
        />
        {validates.email ? <ErrorValidate message={validates.email} /> : ""}
      </div>
      <div>
        <label className={STYLE_LABEL}>Mật khẩu:</label>
        <input
          value={input.password}
          onFocus={() => setValidates((prev) => ({ ...prev, password: "" }))}
          onChange={(e) => handleChangeInput("password", e.target.value)}
          type="password"
          className={`${STYLE_INPUT} ${
            validates.password ? "border-red-500" : ""
          }`}
        />
        {validates.password ? (
          <ErrorValidate message={validates.password} />
        ) : (
          ""
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="checkbox"
            value={isRemember}
            onChange={(e) => setIsRemember(e.target.value)}
            className="h-4 w-4 text-sky-950 focus:ring-sky-900 border-gray-300 rounded"
          />
          <label
            htmlFor="remember"
            className="ml-2 block text-sm text-gray-900"
          >
            Ghi nhớ đăng nhập
          </label>
        </div>
        <div className="text-sm">
          <div
            onClick={() => setStep("sendOtp")}
            className="font-medium text-sky-950 hover:text-sky-800 cursor-pointer"
          >
            Quên mật khẩu?
          </div>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="w-full font-bold bg-sky-950 text-white p-2 rounded-md hover:bg-sky-800 focus:outline-none"
        >
          Đăng nhập
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center font-bold">
        <p>
          Bạn chưa có tài khoản?{" "}
          <span
            onClick={() => setStep("register")}
            className="underline cursor-pointer"
          >
            Đăng ký
          </span>
        </p>
      </div>
      <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-full mb-2 lg:mb-0 font-bold">
          <button
            onClick={handleLoginGoogle}
            type="button"
            className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-4"
              id="google"
            >
              <path
                fill="#fbbb00"
                d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
              ></path>
              <path
                fill="#518ef8"
                d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
              ></path>
              <path
                fill="#28b446"
                d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
              ></path>
              <path
                fill="#f14336"
                d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
              ></path>
            </svg>
            Google
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
