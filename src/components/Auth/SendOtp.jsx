import React, { useState } from "react";
import { validateForm, validateSendOtpSchema } from "../../validate/validate";
import ErrorValidate from "../Notification/ErrorValidate";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../redux/auth/auth.thunk";
import { setEmailVerify } from "../../redux/auth/auth.slice";
import { message } from "antd";

const SendOtp = ({ setStep, setIsReset }) => {
  const [input, setInput] = useState({ email: "" });
  const [validates, setValidates] = useState({});
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validateForm({
      input,
      validateSchema: validateSendOtpSchema,
    });
    if (Object.keys(validationErrors).length > 0)
    {
      setValidates(validationErrors);
      return;
    }
    dispatch(sendOtp({ email: input.email })).then((res) => {
      if (res.payload.success) {
        message.success(res.payload.message);
        dispatch(setEmailVerify(input.email));
        setIsReset(true);
        setStep("verify");
        return;
      }
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-xl font-bold text-center">GỬI MÃ OTP</div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email:
        </label>
        <input
          type="email"
          value={input.email}
          onFocus={() => setValidates((prev) => ({ ...prev, email: "" }))}
          onChange={(e) =>
            setInput((prev) => ({
              ...prev,
              ["email"]: e.target.value,
            }))
          }
          className={`${
            validates.email ? "border-red-500" : ""
          } mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300`}
        />
        {validates.email ? <ErrorValidate message={validates.email} /> : ""}
      </div>
      <div>
        <button
          type="submit"
          className="w-full font-bold bg-sky-950 text-white p-2 rounded-md hover:bg-sky-800 focus:outline-none"
        >
          Gửi OTP
        </button>
      </div>
    </form>
  );
};

export default SendOtp;
