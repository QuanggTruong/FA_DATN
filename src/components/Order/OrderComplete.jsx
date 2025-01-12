import React, { useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Button,
  Image,
  Spin,
  Empty,
  Pagination,
} from "antd";
import {
  RiCheckboxCircleFill,
  RiMapPinLine,
  RiPhoneLine,
  RiStarLine,
  RiStarFill,
  RiFileListLine,
  RiMoneyDollarCircleLine,
  RiFileTextLine,
} from "react-icons/ri";
import { formatPrice } from "../../helpers/formatPrice";
import useScreen from "../../hook/useScreen";
import ModalRate from "../Modal/ModalRate";
import moment from "moment";

const { Text } = Typography;

const PaymentMethodBadge = ({ method }) => {
  const config = {
    COD: { color: "gold", text: "Thanh toán khi nhận hàng" },
    STRIPE: { color: "blue", text: "Thanh toán qua Stripe" },
    VNPAY: { color: "green", text: "Thanh toán qua VNPay" },
  };
  return <Tag color={config[method]?.color}>{config[method]?.text}</Tag>;
};

const OrderComplete = ({
  isLoading = false,
  orders = [],
  page = 1,
  pageSize = 10,
  totalPage = 0,
  totalItems = 0,
  handleChangePaginate,
}) => {
  const { isMobile } = useScreen();
  const [rate, setRate] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [product, setProduct] = useState({
    _id: "",
    name: "",
    image: "",
  });
  const [open, setOpen] = useState(false);

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
                Chưa có đơn hàng hoàn thành
              </h3>
              <p className="text-neutral-500">
                Đơn hàng đã giao thành công sẽ hiển thị tại đây
              </p>
            </div>
          }
        />
      </div>
    );
  }

  const handleClickReview = ({ item, order }) => {
    setOrderId(order._id);
    setProduct({
      _id: item.productId,
      name: item.name,
      image: item.image,
    });
    setOpen(true);
  };

  return (
    <>
      <ModalRate
        {...{
          product,
          order: orderId,
          open,
          setOpen,
          rate,
          setRate,
          setHoverValue,
          hoverValue,
        }}
      />
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
                    icon={<RiCheckboxCircleFill className="text-lg" />}
                    className="flex items-center gap-1 bg-green-50 text-green-600 border-green-100 px-3 py-1"
                  >
                    Giao thành công
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
                        {order.address}, {order.ward.name},{" "}
                        {order.district.name}, {order.province.name}
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
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Text className="text-base font-medium text-rose-600">
                            {formatPrice(item.price)}đ
                          </Text>
                          <Button
                            onClick={() => handleClickReview({ item, order })}
                            disabled={item.isReviewed}
                            icon={
                              item.isReviewed ? (
                                <RiStarFill className="text-yellow-400" />
                              ) : (
                                <RiStarLine />
                              )
                            }
                            className={`flex items-center gap-2 px-6 ${
                              item.isReviewed
                                ? "bg-gray-50 text-gray-400 border-gray-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                            }`}
                          >
                            {item.isReviewed ? "Đã đánh giá" : "Viết đánh giá"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 mt-6 border-t border-neutral-200/80">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RiMoneyDollarCircleLine className="text-xl text-neutral-400" />
                    <Text className="text-neutral-500">
                      Tổng thanh toán:{" "}
                      <span className="text-lg text-neutral-800 font-bold">
                        {formatPrice(order.totalAmount)}đ
                      </span>
                    </Text>
                  </div>
                </div>

                <div className="text-right">
                  <Text className="text-neutral-500 block mb-1">
                    Hoàn thành vào:{" "}
                    <span>
                      {moment(order.updatedAt).format("HH:mm - DD/MM/YYYY")}
                    </span>
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {orders.length > 0 && totalItems > pageSize && (
        <div className="flex justify-end mt-6">
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
            className="bg-white p-4 rounded-lg shadow-sm"
          />
        </div>
      )}
    </>
  );
};

export default OrderComplete;
