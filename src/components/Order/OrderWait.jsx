import React from "react";
import {
  Card,
  Typography,
  Tag,
  Button,
  Image,
  Spin,
  Empty,
  Pagination,
  message,
  Tooltip,
} from "antd";
import {
  RiTimeLine,
  RiMapPinLine,
  RiPhoneLine,
  RiFileTextLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiFileListLine,
} from "react-icons/ri";
import { formatPrice } from "../../helpers/formatPrice";
import useScreen from "../../hook/useScreen";
import { useDispatch } from "react-redux";
import {
  getOrderHistory,
  updateStatuByCustomer,
} from "../../redux/order/order.thunk";

const { Text } = Typography;

const PaymentMethodBadge = ({ method }) => {
  const config = {
    COD: { color: "gold", text: "Thanh toán khi nhận hàng" },
    STRIPE: { color: "blue", text: "Thanh toán qua Stripe" },
    VNPAY: { color: "green", text: "Thanh toán qua VNPay" },
  };
  return <Tag color={config[method]?.color}>{config[method]?.text}</Tag>;
};

const OrderWait = ({
  isLoading = false,
  orders = [],
  page = 1,
  pageSize = 10,
  totalPage = 0,
  totalItems = 0,
  handleChangePaginate,
}) => {
  const { isMobile } = useScreen();
  const dispatch = useDispatch();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-neutral-50/50 rounded-xl">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-neutral-500">
                Đơn hàng chờ xác nhận sẽ được hiển thị tại đây
              </p>
            </div>
          }
        />
      </div>
    );
  }

  const handleCancelOrder = async (order) => {
    if (order.paymentMethod === "STRIPE" || order.paymentMethod === "VNPAY") {
      message.warning({
        content: "Đơn hàng đã thanh toán không thể hủy",
        icon: <RiErrorWarningLine className="text-2xl" />,
      });
      return;
    }
    const res = await dispatch(
      updateStatuByCustomer({ id: order._id, status: "cancelled" })
    ).unwrap();
    if (res.success) {
      message.success(res.message);
      dispatch(
        getOrderHistory({
          status: "pending",
          page,
          pageSize,
        })
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8">
      {orders?.map((order, idx) => (
        <Card
          key={`order-${idx}`}
          className="border border-neutral-200/80 hover:border-neutral-300 transition-all duration-300"
        >
          {/* Order Header */}
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200/80">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <RiFileListLine className="text-xl text-neutral-400" />
                <div>
                  <Text className="text-neutral-500 text-sm block">
                    Mã đơn hàng:
                  </Text>
                  <Text className="font-medium text-neutral-800">
                    #{order._id?.slice(-8).toUpperCase()}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <PaymentMethodBadge method={order.paymentMethod} />
                <Tag
                  icon={<RiTimeLine className="text-lg" />}
                  className="flex items-center gap-1 bg-amber-50 text-amber-600 border-amber-100 px-3 py-1"
                >
                  Chờ xác nhận
                </Tag>
              </div>
            </div>
          </div>

          {/* Order Content */}
          <div className="p-6">
            {/* Shipping Info */}
            <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <RiMapPinLine className="text-lg" />
                    <Text strong>Địa chỉ nhận hàng:</Text>
                  </div>
                  <div className="ml-6 space-y-1">
                    <Text className="block">{order.name}</Text>
                    <Text className="block text-neutral-500">
                      {order.address}, {order.ward.name}, {order.district.name},{" "}
                      {order.province.name}
                    </Text>
                    <Text className="block">
                      <RiPhoneLine className="inline mr-2" />
                      {order.phone}
                    </Text>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <RiFileTextLine className="text-lg" />
                    <Text strong>Ghi chú:</Text>
                  </div>
                  <Text className="block ml-6 text-neutral-500">
                    {order.note || "Không có ghi chú"}
                  </Text>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="divide-y divide-neutral-200/80">
              {order?.products?.map((item, index) => (
                <div
                  key={`item-${index}`}
                  className="py-6 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative group">
                      <Image
                        width={isMobile ? "100%" : 100}
                        height={isMobile ? "auto" : 100}
                        src={item.image}
                        alt={item.name}
                        className="object-cover rounded-lg brightness-95"
                        preview={false}
                      />
                    </div>

                    <div className="flex-1">
                      <div>
                        <Text className="text-base font-medium text-neutral-800 block">
                          {item.name}
                        </Text>
                        <div className="flex flex-wrap gap-6 text-neutral-600">
                          <div>
                            Số lượng:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-base font-bold text-rose-600">
                        {formatPrice(item.price)}đ
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 mt-6 border-t border-neutral-200/80">
              <div>
                <Text className="text-neutral-500 block sm:inline mr-2">
                  Tổng thanh toán:{" "}
                  <span className="text-lg font-bold text-neutral-800">
                    {" "}
                    {formatPrice(order.totalAmount)}đ
                  </span>
                </Text>
              </div>

              <Tooltip
                title={
                  order.paymentMethod === "STRIPE" ||
                  order.paymentMethod === "VNPAY"
                    ? "Đơn hàng đã thanh toán không thể hủy"
                    : ""
                }
              >
                <Button
                  danger
                  size="large"
                  onClick={() => handleCancelOrder(order)}
                  className={`min-w-[140px] flex items-center justify-center gap-2 ${
                    order.paymentMethod === "STRIPE" ||
                    order.paymentMethod === "VNPAY"
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                  disabled={
                    order.paymentMethod === "STRIPE" ||
                    order.paymentMethod === "VNPAY"
                  }
                  icon={<RiCloseLine className="text-lg" />}
                >
                  Hủy đơn hàng
                </Button>
              </Tooltip>
            </div>
          </div>
        </Card>
      ))}

      {orders.length > 0 && totalItems > pageSize && (
        <div className="flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={handleChangePaginate}
            showSizeChanger={false}
            showQuickJumper={false}
            showTotal={(total, range) => (
              <span className="text-neutral-500">
                {`${range[0]}-${range[1]} của ${total} đơn hàng`}
              </span>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default OrderWait;
