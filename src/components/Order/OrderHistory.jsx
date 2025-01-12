import React, { useEffect, useState } from "react";
import { Tabs, Typography, Layout, Badge } from "antd";
import {
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import OrderWait from "./OrderWait";
import OrderShip from "./OrderShip";
import OrderComplete from "./OrderComplete";
import OrderCancel from "./OrderCancel";
import { getOrderHistory } from "../../redux/order/order.thunk";
import { useDispatch, useSelector } from "react-redux";

const { Title } = Typography;
const { Content } = Layout;

const OrderHistory = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("1");
  const {
    orderHistories: orders,
    isLoading,
    pagination,
    statusCounts,
  } = useSelector((state) => state.order);
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  });

  const fetchOrders = (tabKey) => {
    let status;
    switch (tabKey) {
      case "1":
        status = "pending";
        break;
      case "2":
        status = "shipping";
        break;
      case "3":
        status = "delivered";
        break;
      case "4":
        status = "cancelled";
        break;
      default:
        status = "processing";
    }
    dispatch(
      getOrderHistory({
        status,
        page: paginate.page,
        pageSize: paginate.pageSize,
      })
    );
  };

  const handleChangePaginate = (key, value) => {
    setPaginate((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination?.page,
        pageSize: pagination?.pageSize,
        totalPage: pagination?.totalPage,
        totalItems: pagination?.totalItems,
      }));
    }
  }, [pagination]);

  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center">
          <ClockCircleOutlined className="mr-2" />
          Đang chờ{" "}
          <Badge
            className="px-2"
            color="#3b71ca"
            count={statusCounts?.pending}
          />
        </span>
      ),
      children: (
        <OrderWait
          {...{
            isLoading,
            orders,
            page: paginate.page,
            pageSize: paginate.pageSize,
            totalPage: paginate.totalPage,
            totalItems: paginate.totalItems,
            handleChangePaginate,
          }}
        />
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center">
          <CarOutlined className="mr-2" />
          Đang giao{" "}
          <Badge
            className="px-2"
            color="#3b71ca"
            count={statusCounts?.shipping}
          />
        </span>
      ),
      children: (
        <OrderShip
          {...{
            isLoading,
            orders,
            page: paginate.page,
            pageSize: paginate.pageSize,
            totalPage: paginate.totalPage,
            totalItems: paginate.totalItems,
            handleChangePaginate,
          }}
        />
      ),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center">
          <CheckCircleOutlined className="mr-2" />
          Hoàn thành
          <Badge
            className="px-2"
            color="#3b71ca"
            count={statusCounts?.delivered}
          />
        </span>
      ),
      children: (
        <OrderComplete
          {...{
            isLoading,
            orders,
            page: paginate.page,
            pageSize: paginate.pageSize,
            totalPage: paginate.totalPage,
            totalItems: paginate.totalItems,
            handleChangePaginate,
          }}
        />
      ),
    },
    {
      key: "4",
      label: (
        <span className="flex items-center">
          <CloseCircleOutlined className="mr-2" />
          Đã hủy{" "}
          <Badge
            className="px-2"
            color="#3b71ca"
            count={statusCounts?.cancelled}
          />
        </span>
      ),
      children: (
        <OrderCancel
          {...{
            isLoading,
            orders,
            page: paginate.page,
            pageSize: paginate.pageSize,
            totalPage: paginate.totalPage,
            totalItems: paginate.totalItems,
            handleChangePaginate,
          }}
        />
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Layout className="bg-[#f9fafc]">
      <Content>
        <Title level={5} className="mb-6">
          Lịch sử đơn hàng
        </Title>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={items}
          className="order-history-tabs"
          type="card"
        />
      </Content>
    </Layout>
  );
};

export default OrderHistory;
