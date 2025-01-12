import React, { useState } from "react";
import logo from "../../resources/logo.png";
import {
  validateForm,
  validateLoginAdminSchema,
} from "../../validate/validate";
import ErrorValidate from "../../components/Notification/ErrorValidate";
import { useDispatch } from "react-redux";
import { getAccountAdmin, loginAdmin } from "../../redux/auth/auth.thunk";
import { message } from "antd";
import { set } from "../../storage/storage";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [validates, setValidates] = useState({});

  const changeInput = (key, value) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setValidates((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = await validateForm({
      input,
      validateSchema: validateLoginAdminSchema,
    });

    if (Object.keys(validationErrors).length > 0) {
      setValidates(validationErrors);
      return;
    }

    dispatch(loginAdmin(input)).then((res) => {
      if (res.payload.success) {
        set("ACCESS_TOKEN_ADMIN", res.payload.data.accessToken);
        dispatch(getAccountAdmin()).then(() => {
          message.success("Đăng nhập thành công");
          navigate("/admin/dashboard");
        });
      }
    });
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="min-h-screen bg-gradient-to-r from-purple-200 to-purple-50 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">ADMIN</h1>
              <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-xs space-y-4">
                  <div>
                    <input
                      className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
                        validates.username
                          ? "border-red-500"
                          : "border-gray-200"
                      } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      type="text"
                      placeholder="Tên đăng nhập"
                      value={input.username}
                      onChange={(e) => changeInput("username", e.target.value)}
                    />
                    {validates.username ? (
                      <ErrorValidate message={validates.username} />
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <input
                      className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
                        validates.password
                          ? "border-red-500"
                          : "border-gray-200"
                      } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      type="password"
                      placeholder="Mật khẩu"
                      value={input.password}
                      onChange={(e) => changeInput("password", e.target.value)}
                    />
                    {validates.password ? (
                      <ErrorValidate message={validates.password} />
                    ) : (
                      ""
                    )}
                  </div>
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-gradient-to-r from-purple-600 to-purple-500 text-gray-100 w-full py-4 rounded-lg hover:bg-purple-300 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span className="ml-3">Đăng nhập</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-[#e7d2fd] text-center hidden lg:flex">
            <div
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/736x/04/05/5d/04055d5123b3a887f08290d11fd14085.jpg')",
              }}
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            ></div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginAdmin;
