import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, message } from "antd";
import { useDispatch } from "react-redux";
import {
  getOrderList,
  updateOrderByAdmin,
} from "../../redux/order/order.thunk";

const { Option } = Select;

const ModalDetailOrder = ({
  open,
  setOpen,
  order,
  setOrder,
  page,
  pageSize,
  customerName,
  statusOrder,
  fromDate,
  toDate,
  paymentMethod,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(order?.status);
  const [note, setNote] = useState(order?.note);
  const [name, setName] = useState(order?.name);
  const [phone, setPhone] = useState(order?.phone);
  const [address, setAddress] = useState(order?.address);

  useEffect(() => {
    if (order) {
      setStatus(order?.status);
      setNote(order?.note);
      setName(order?.name);
      setPhone(order?.phone);
      setAddress(order?.address);
    }
  }, [order]);

  const statusOptions = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "shipping", label: "Đang giao hàng" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const handleUpdate = () => {
    const dataUpdate = {
      id: order._id,
      status: statusOrder,
      note,
      phone,
      address,
      name,
    };
    dispatch(updateOrderByAdmin(dataUpdate)).then((res) => {
      if (res.payload.success) {
        message.success(res.payload.message);
        dispatch(
          getOrderList({
            page,
            pageSize,
            customerName,
            status,
            fromDate,
            toDate,
            paymentMethod,
          })
        );
        setOpen(false);
        setOrder(null);
      }
    });
  };

  const inputClassName =
    "w-full px-3 py-2 text-gray-700 border border-[#c4c4c4] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={800}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="font-semibold">Mã đơn hàng</p>
            <p>{order?._id}</p>
          </div>
          <div>
            <p className="font-semibold">Ngày đặt hàng</p>
            <p>{new Date(order?.createdAt).toLocaleString("vi-VN")}</p>
          </div>
          <div>
            <label className={labelClassName}>Trạng thái</label>
            <Select
              className="w-full"
              value={status}
              onChange={(value) => setStatus(value)}
            >
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <p className="font-semibold">Phương thức thanh toán</p>
            <p>{order?.paymentMethod}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Thông tin khách hàng</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Tên:</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>Số điện thoại:</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClassName}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClassName}>Địa chỉ:</label>
            <Input.TextArea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Sản phẩm</th>
                <th className="p-2 text-right">Giá</th>
                <th className="p-2 text-right">Số lượng</th>
                <th className="p-2 text-right">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {order?.products?.map((product) => (
                <tr key={product.productId} className="border-b">
                  <td className="p-2">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover mr-2"
                      />
                      <div>
                        <p className="max-w-52 font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          Kích thước: {product.size ? product.size : "KHÔNG CÓ"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    {product.price.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="p-2 text-right">{product.quantity}</td>
                  <td className="p-2 text-right">
                    {(product.price * product.quantity).toLocaleString("vi-VN")}
                    đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <p className="text-right">
            <span className="font-semibold">Tổng tiền:</span>{" "}
            {order?.totalAmount.toLocaleString("vi-VN")}đ
          </p>
        </div>

        <div className="mb-6">
          <label className={labelClassName}>Ghi chú</label>
          <Input.TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className={inputClassName}
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setOpen(false)}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Đóng
          </Button>
          <Button
            type="primary"
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetailOrder;
