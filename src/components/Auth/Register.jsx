import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateForm, validateRegisterSchema } from "../../validate/validate";
import ErrorValidate from "../Notification/ErrorValidate";
import { message } from "antd";
import { registerCustomer } from "../../redux/auth/auth.thunk";
import { setEmailVerify } from "../../redux/auth/auth.slice";

const STYLE_LABEL = "block text-sm font-medium text-gray-700";
const STYLE_INPUT =
  "mt-1 p-2 w-full border rounded-md bg-transparent text-gray-700 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300";

const Register = ({ setStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [validates, setValidates] = useState({});

  const handleChangeInput = (key, value) => {
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validateForm({
      input,
      validateSchema: validateRegisterSchema,
    });
    if (Object.keys(validationErrors).length > 0) {
      setValidates(validationErrors);
      return;
    }
    if (input.password !== input.rePassword) {
      message.error("Mật khẩu nhập lại không trùng khớp");
      return;
    }
    dispatch(registerCustomer(input)).then((res) => {
      if (res.payload.success) {
        message.success(res.payload.message);
        dispatch(setEmailVerify(input.email));
        navigate("/auth");
        setStep("verify");
        return;
      }
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-xl font-bold text-center">ĐĂNG KÝ</div>
      <div>
        <label className={STYLE_LABEL}>Họ và tên:</label>
        <input
          value={input.name}
          onFocus={() => setValidates((prev) => ({ ...prev, name: "" }))}
          onChange={(e) => handleChangeInput("name", e.target.value)}
          type="text"
          className={`${STYLE_INPUT} ${validates.name ? "border-red-500" : ""}`}
        />
        {validates.name ? <ErrorValidate message={validates.name} /> : ""}
      </div>
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
      <div>
        <label className={STYLE_LABEL}>Nhập lại mật khẩu</label>
        <input
          value={input.rePassword}
          onFocus={() => setValidates((prev) => ({ ...prev, rePassword: "" }))}
          onChange={(e) => handleChangeInput("rePassword", e.target.value)}
          type="password"
          className={`${STYLE_INPUT} ${
            validates.rePassword ? "border-red-500" : ""
          }`}
        />
        {validates.rePassword ? (
          <ErrorValidate message={validates.rePassword} />
        ) : (
          ""
        )}
      </div>
      <div>
        <button
          type="submit"
          className="w-full font-bold bg-sky-950 text-white p-2 rounded-md hover:bg-sky-800 focus:outline-none"
        >
          Đăng ký
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center font-bold">
        <p>
          Bạn đã có tài khoản?{" "}
          <span
            onClick={() => {
              navigate("/auth");
              setStep("login");
            }}
            className="underline cursor-pointer"
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </form>
  );
};

export default Register;
