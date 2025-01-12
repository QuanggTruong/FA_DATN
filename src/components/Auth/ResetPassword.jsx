import React, { useState } from "react";
import {
  validateForm,
  validateResetPasswordSchema,
} from "../../validate/validate";
import ErrorValidate from "../Notification/ErrorValidate";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/auth/auth.thunk";
import { message } from "antd";
import { setEmailVerify } from "../../redux/auth/auth.slice";

const STYLE_INPUT =
  "mt-1 p-2 w-full border rounded-md bg-transparent text-gray-700 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300";
const STYLE_LABEL = "block text-sm font-medium text-gray-700";

const ResetPassword = ({ setStep, setIsReset }) => {
  const dispatch = useDispatch();
  const { emailVerify } = useSelector((state) => state.auth);
  const [input, setInput] = useState({
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
    if (input.password !== input.rePassword) {
      message.error("Mật khẩu nhập lại không trùng khớp");
      return;
    }
    const validationErrors = await validateForm({
      input,
      validateSchema: validateResetPasswordSchema,
    });
    if (Object.keys(validationErrors).length > 0) {
      setValidates(validationErrors);
      return;
    }
    dispatch(
      resetPassword({
        email: emailVerify,
        password: input.password,
      })
    ).then((res) => {
      if (res.payload.success) {
        message.success(res.payload.message);
        dispatch(setEmailVerify(""));
        setStep("login");
        setIsReset(false);
        return;
      }
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-xl font-bold text-center">ĐẶT LẠI MẬT KHẨU</div>
      <div>
        <label className={STYLE_LABEL}>Mật khẩu mới:</label>
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
        <label className={STYLE_LABEL}>Xác nhận mật khẩu mới:</label>
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
          Đặt lại mật khẩu
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center font-bold">
        <span
          onClick={() => setStep("login")}
          className="underline cursor-pointer"
        >
          Quay lại đăng nhập
        </span>
      </div>
    </form>
  );
};

export default ResetPassword;
