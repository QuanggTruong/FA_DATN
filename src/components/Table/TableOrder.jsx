import React, { useState } from "react";
import { Table, Select, message, Tooltip, Popconfirm, Pagination } from "antd";
import { FaEye } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import ModalDetailOrder from "../Modal/ModalDetailOrder";
import { useDispatch } from "react-redux";
import {
  deleteOrder,
  getOrderList,
  updateOrderByAdmin,
} from "../../redux/order/order.thunk";

const TableOrder = ({
  orders = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
  customerName,
  status,
  fromDate,
  toDate,
  paymentMethod,
}) => {
  const statusOptions = [
    { value: "pending", label: "Chờ xử lý", color: "orange" },
    { value: "processing", label: "Đang xử lý", color: "blue" },
    { value: "shipping", label: "Đang giao hàng", color: "cyan" },
    { value: "delivered", label: "Đã giao hàng", color: "green" },
    { value: "cancelled", label: "Đã hủy", color: "red" },
  ];
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);

  const handleStatusChange = (data) => {
    dispatch(updateOrderByAdmin(data)).then((res) => {
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
      }
    });
  };

  const removeOrder = (id) => {
    dispatch(deleteOrder(id)).then((res) => {
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
      }
    });
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => {
        const displayIndex = (page - 1) * pageSize + index + 1;
        return <span>{displayIndex}</span>;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "orderId",
      ellipsis: true,
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "customerName",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => (
        <span className="font-bold">{text.toLocaleString("vi-VN")} đ</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          disabled={status === "delivered" ? true : false}
          value={status}
          style={{ width: 180 }}
          onChange={(newStatus) =>
            handleStatusChange({ id: record._id, status: newStatus })
          }
        >
          {statusOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span>{new Date(text).toLocaleString("vi-VN")}</span>,
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2 items-center text-[#00246a]">
          <Tooltip title="Xem">
            <button
              onClick={() => {
                setOrderDetail(record);
                setOpen(true);
              }}
              className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
            >
              <FaEye />
            </button>
          </Tooltip>
          <Popconfirm
            className="max-w-40"
            placement="topLeft"
            title={"Xác nhận xóa thông tin đơn hàng"}
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => removeOrder(record._id)}
            destroyTooltipOnHide={true}
          >
            <Tooltip title="Xóa">
              <button className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors">
                <MdOutlineDeleteOutline />
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleChangePage = (key, value) => {
    setPaginate((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <ModalDetailOrder
        {...{
          order: orderDetail,
          setOpen,
          open,
          setOrder: setOrderDetail,
          page,
          pageSize,
          customerName,
          statusOrder: status,
          fromDate,
          toDate,
          paymentMethod,
        }}
      />
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {orders.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page) => handleChangePage("page", page)}
            onShowSizeChange={(_, size) => handleChangePage("pageSize", size)}
            showSizeChanger
          />
        </div>
      )}
    </>
  );
};

export default TableOrder;
