import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderList } from "../../redux/order/order.thunk";
import { Input, Select, DatePicker, Space, Button, Card } from "antd";
import {
  BankOutlined,
  CreditCardOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/vi_VN";
import TableOrder from "../../components/Table/TableOrder";
import debounce from "lodash/debounce";

const { RangePicker } = DatePicker;

const ManageOrder = () => {
  const dispatch = useDispatch();
  const { orders, pagination, isLoading } = useSelector((state) => state.order);

  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  });

  const [filters, setFilters] = useState({
    customerName: "",
    status: "",
    fromDate: "",
    toDate: "",
    paymentMethod: "",
  });

  useEffect(() => {
    dispatch(getOrderList({ ...paginate, ...filters }));
  }, [dispatch, paginate.page, paginate.pageSize, filters]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPage: pagination.totalPage,
        totalItems: pagination.totalUsers,
      }));
    }
  }, [pagination]);

  const debouncedFilter = useCallback(
    debounce((name, value) => {
      setFilters((prev) => ({ ...prev, [name]: value }));
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );

  const handleFilterChange = (name, value) => {
    debouncedFilter(name, value);
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setFilters((prev) => ({
      ...prev,
      fromDate: dateStrings[0],
      toDate: dateStrings[1],
    }));
    setPaginate((prev) => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    setFilters((prev) => ({
      ...prev,
      customerName: "",
      status: "",
      fromDate: "",
      toDate: "",
      paymentMethod: "",
    }));
    setPaginate((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="py-8">
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Card className="mb-4 shadow-lg">
          <div className="flex flex-wrap gap-4">
            {/* Search Input */}
            <div className="flex-grow min-w-[200px] max-w-xs">
              <Input
                placeholder="Tên khách hàng"
                allowClear
                size="large"
                prefix={<UserOutlined className="text-gray-400" />}
                onChange={(e) =>
                  handleFilterChange("customerName", e.target.value)
                }
                className="w-full"
              />
            </div>

            {/* Status Select */}
            <div className="flex-grow min-w-[150px] max-w-xs">
              <Select
                placeholder="Trạng thái"
                size="large"
                onChange={(value) => handleFilterChange("status", value)}
                allowClear
                className="w-full"
              >
                <Select.Option value="pending">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Chờ xử lý
                  </div>
                </Select.Option>
                <Select.Option value="processing">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Đang xử lý
                  </div>
                </Select.Option>
                <Select.Option value="shipping">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Đang giao hàng
                  </div>
                </Select.Option>
                <Select.Option value="delivered">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Đã giao hàng
                  </div>
                </Select.Option>
                <Select.Option value="cancelled">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Đã hủy
                  </div>
                </Select.Option>
              </Select>
            </div>

            {/* Date Range Picker */}
            <div className="flex-grow min-w-[250px] max-w-xs">
              <RangePicker
                locale={locale}
                onChange={handleDateRangeChange}
                size="large"
                className="w-full"
              />
            </div>

            {/* Payment Method Select */}
            <div className="flex-grow min-w-[200px] max-w-xs">
              <Select
                placeholder="Phương thức thanh toán"
                size="large"
                onChange={(value) => handleFilterChange("paymentMethod", value)}
                allowClear
                className="w-full"
              >
                <Select.Option value="COD">
                  <div className="flex items-center gap-2">
                    <DollarOutlined />
                    COD
                  </div>
                </Select.Option>
                <Select.Option value="STRIPE">
                  <div className="flex items-center gap-2">
                    <CreditCardOutlined />
                    STRIPE
                  </div>
                </Select.Option>
                <Select.Option value="VNPAY">
                  <div className="flex items-center gap-2">
                    <BankOutlined />
                    VNPAY
                  </div>
                </Select.Option>
              </Select>
            </div>
          </div>
        </Card>
        <TableOrder
          {...{
            orders,
            isLoading,
            page: paginate.page,
            pageSize: paginate.pageSize,
            totalItems: paginate.totalItems,
            setPaginate,
            customerName: filters.customerName,
            status: filters.status,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            paymentMethod: filters.paymentMethod,
          }}
        />
      </Space>
    </div>
  );
};

export default ManageOrder;
