import React from "react";
import { MdError } from "react-icons/md";

const ErrorValidate = ({ message = "" }) => {
  return (
    <div className="text-red-500 font-medium text-sm py-1 flex gap-1 items-center">
      <MdError />
      <span> {message}</span>
    </div>
  );
};

export default ErrorValidate;
