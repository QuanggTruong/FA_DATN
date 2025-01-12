import { Popconfirm } from "antd";
import React from "react";

const ModalConfirm = ({
  data = {},
  placement = "topLeft",
  title = "",
  description = "",
  okText = "Xóa",
  cancelText = "Hủy",
  handleOk,
  open = false,
  setOpen,
  children,
  isLoading,
}) => {
  const handleConfirm = () => {
    handleOk(data?._id);
  };

  return (
    <Popconfirm
      placement={placement}
      open={open}
      title={title}
      description={description}
      okText={okText}
      cancelText={cancelText}
      onConfirm={handleConfirm}
      onCancel={() => setOpen(false)}
      okButtonProps={{
        loading: isLoading,
      }}
      destroyTooltipOnHide={true}
    >
      {children}
    </Popconfirm>
  );
};

export default ModalConfirm;
