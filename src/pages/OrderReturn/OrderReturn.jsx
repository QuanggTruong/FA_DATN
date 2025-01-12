// import React, { useEffect, useState } from "react";
// import { Result, Button, Typography, Divider, Timeline } from "antd";
// import {
//   CheckCircleFilled,
//   CloseCircleFilled,
//   ShoppingCartOutlined,
//   FieldTimeOutlined,
//   CarOutlined,
//   SmileOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import {
//   orderStripeReturn,
//   orderVnpayReturn,
// } from "../../redux/order/order.thunk";
// import { formatDateOrder } from "../../helpers/formatDate";
// import { formatPrice } from "../../helpers/formatPrice";
// import Loading from "../../components/Loading";
// import { clearCart } from "../../redux/cart/cart.slice";
// import { isEmpty } from "lodash";

// const { Title, Text } = Typography;

// const OrderReturn = () => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isSuccess, setIsSuccess] = useState(true);
//   const queryParams = new URLSearchParams(location.search);
//   const { orderReturn, isLoading, error } = useSelector((state) => state.order);

//   const orderId = queryParams.get("vnp_TxnRef");
//   const code = queryParams.get("vnp_ResponseCode");
//   const stripeSessionId = queryParams.get("session_id");
//   const orderSessionId = queryParams.get("order_session") || "";

//   useEffect(() => {
//     if (
//       !orderId &&
//       !code &&
//       !orderReturn._id &&
//       !error.message &&
//       !stripeSessionId &&
//       !orderSessionId
//     ) {
//       navigate("/");
//     }
//   }, [orderReturn._id, orderId, code, error, stripeSessionId, orderSessionId]);

//   useEffect(() => {
//     if (orderId && code) {
//       dispatch(orderVnpayReturn({ orderId, code })).then((res) => {
//         if (res.payload.success) {
//           dispatch(clearCart());
//           setIsSuccess(true);
//           navigate("/order-return");
//         } else {
//           setIsSuccess(false);
//           navigate("/order-return");
//         }
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (stripeSessionId || orderSessionId) {
//       dispatch(orderStripeReturn({ stripeSessionId, orderSessionId })).then(
//         (res) => {
//           if (res.payload.success) {
//             dispatch(clearCart());
//             setIsSuccess(true);
//             navigate("/order-return");
//           } else {
//             setIsSuccess(false);
//             navigate("/order-return");
//           }
//         }
//       );
//     }
//   }, []);

//   const handleHomePage = () => {
//     navigate("/");
//   };

//   const handleContinueShopping = () => {
//     navigate("/cart");
//   };

//   const SuccessContent = () => (
//     <>
//       {!isEmpty(orderReturn) && (
//         <>
//           <div className="text-center mb-8">
//             <Text className="text-gray-500">
//               Đặt ngày {formatDateOrder(orderReturn?.createdAt)}
//             </Text>
//           </div>
//           <Divider />
//           <div className="mb-8">
//             <Title level={4}>Thông tin đơn hàng</Title>
//             <div className="flex justify-between items-center mb-2">
//               <Text>Tổng tiền:</Text>
//               <Text strong>{formatPrice(orderReturn?.totalAmount)} đ</Text>
//             </div>
//             <div className="flex justify-between items-center mb-2">
//               <Text>Phương thức thanh toán:</Text>
//               <Text>{orderReturn?.paymentMethod}</Text>
//             </div>
//             <div className="flex justify-between items-center">
//               <Text>Địa chỉ giao hàng:</Text>
//               <Text className="text-right">{orderReturn?.address}</Text>
//             </div>
//           </div>
//           <Divider />
//           <div className="mb-8">
//             <Title level={4}>Trạng thái đơn hàng</Title>
//             <Timeline
//               items={[
//                 {
//                   color: "green",
//                   children: "Đơn hàng đã đặt thành công",
//                   dot: <ShoppingCartOutlined className="text-xl" />,
//                 },
//                 {
//                   color: "blue",
//                   children: "Đang xử lý",
//                   dot: <FieldTimeOutlined className="text-xl" />,
//                 },
//                 {
//                   color: "gray",
//                   children: "Đang giao hàng",
//                   dot: <CarOutlined className="text-xl" />,
//                 },
//                 {
//                   color: "gray",
//                   children: "Đã giao hàng",
//                   dot: <SmileOutlined className="text-xl" />,
//                 },
//               ]}
//             />
//           </div>
//         </>
//       )}
//     </>
//   );

//   const FailureContent = () => (
//     <>
//       {error && (
//         <>
//           <div className="text-center mb-8">
//             <Title level={3} className="text-red-600">
//               {error?.message}
//             </Title>
//             <Text className="text-gray-500">
//               Vui lòng kiểm tra lại thông tin và thử lại
//             </Text>
//           </div>
//         </>
//       )}
//     </>
//   );

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-400 to-purple-800 p-6">
//           <Result
//             icon={
//               isSuccess ? (
//                 <CheckCircleFilled className="text-white text-7xl" />
//               ) : (
//                 <CloseCircleFilled className="text-white text-7xl" />
//               )
//             }
//             title={
//               <span className="text-white text-3xl font-bold">
//                 {isSuccess ? "Đặt hàng thành công!" : "Đặt hàng thất bại"}
//               </span>
//             }
//             subTitle={
//               <span className="text-white text-lg">
//                 {isSuccess
//                   ? "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý."
//                   : "Rất tiếc, đã xảy ra lỗi khi xử lý đơn hàng của bạn. Vui lòng thử lại."}
//               </span>
//             }
//           />
//         </div>
//         <div className="p-8">
//           {isSuccess ? <SuccessContent /> : <FailureContent />}
//           <div className="flex justify-center space-x-4 mt-8">
//             <Button
//               type="primary"
//               size="large"
//               onClick={isSuccess ? handleHomePage : handleContinueShopping}
//               className="bg-blue-500 hover:bg-blue-600"
//             >
//               {isSuccess ? "Trang chủ" : "Giỏ hàng"}
//             </Button>
//             <Button size="large" onClick={handleContinueShopping}>
//               {isSuccess ? "Tiếp tục mua sắm" : "Quay lại trang chủ"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderReturn;

import React, { useEffect, useState } from "react";
import {
  Result,
  Button,
  Typography,
  Timeline,
  Card,
  Tag,
  Tooltip,
  Modal,
} from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CrownOutlined,
  PrinterOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  orderStripeReturn,
  orderVnpayReturn,
} from "../../redux/order/order.thunk";
import { formatDateOrder } from "../../helpers/formatDate";
import { formatPrice } from "../../helpers/formatPrice";
import { clearCart } from "../../redux/cart/cart.slice";
import { isEmpty } from "lodash";

const { Title, Text, Paragraph } = Typography;

const OrderReturn = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const {
    orderReturn: order,
    isLoading,
    error,
  } = useSelector((state) => state.order);

  const orderId = queryParams.get("vnp_TxnRef");
  const code = queryParams.get("vnp_ResponseCode");
  const stripeSessionId = queryParams.get("session_id");
  const orderSessionId = queryParams.get("order_session") || "";

  useEffect(() => {
    if (
      !orderId &&
      !code &&
      !order._id &&
      !error.message &&
      !stripeSessionId &&
      !orderSessionId
    ) {
      navigate("/");
    }
  }, [order._id, orderId, code, error, stripeSessionId, orderSessionId]);

  useEffect(() => {
    if (orderId && code) {
      dispatch(orderVnpayReturn({ orderId, code })).then((res) => {
        if (res.payload.success) {
          dispatch(clearCart());
          setIsSuccess(true);
          navigate("/order-return");
        } else {
          setIsSuccess(false);
          navigate("/order-return");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (stripeSessionId || orderSessionId) {
      dispatch(orderStripeReturn({ stripeSessionId, orderSessionId })).then(
        (res) => {
          if (res.payload.success) {
            dispatch(clearCart());
            setIsSuccess(true);
            navigate("/order-return");
          } else {
            setIsSuccess(false);
            navigate("/order-return");
          }
        }
      );
    }
  }, []);

  const OrderTimeline = () => (
    <Card className="shadow-lg bg-white">
      <Title level={4} className="mb-6 flex items-center">
        <ClockCircleOutlined className="mr-2 text-yellow-600" />
        Theo dõi đơn hàng
      </Title>
      <Timeline
        items={[
          {
            color: "#CA8A04",
            children: (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg shadow-sm">
                <Title level={5} className="text-yellow-600 mb-1">
                  Đơn hàng đã xác nhận
                </Title>
                <Text className="text-gray-600">
                  Đơn hàng của bạn đã được xác nhận
                </Text>
                <Tag color="warning" className="mt-2 mx-1">
                  {formatDateOrder(order?.createdAt)}
                </Tag>
              </div>
            ),
          },
          {
            color: "#CA8A04",
            children: (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg shadow-sm">
                <Title level={5} className="text-yellow-600 mb-1">
                  Đang chuẩn bị
                </Title>
                <Text className="text-gray-600">
                  Đơn hàng đang được kiểm tra và đóng gói cẩn thận
                </Text>
                <Tag color="processing" className="mt-2 mx-1">
                  Dự kiến 1-2 ngày
                </Tag>
              </div>
            ),
          },
          {
            color: "#CA8A04",
            children: (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg shadow-sm">
                <Title level={5} className="text-yellow-600 mb-1">
                  Vận chuyển
                </Title>
                <Text className="text-gray-600">
                  Đơn hàng sẽ được giao bởi đơn vị vận chuyển uy tín
                </Text>
                <Tag color="processing" className="mt-2 mx-1">
                  2-3 ngày làm việc
                </Tag>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );

  const OrderDetails = () => (
    <Card
      className="shadow-lg bg-white"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CrownOutlined className="text-yellow-600 text-xl mr-2" />
            <span className="text-lg">Chi tiết đơn hàng</span>
          </div>
          <Tooltip title="In đơn hàng">
            <Button
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
              className="border-yellow-600 text-yellow-600"
            />
          </Tooltip>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-yellow-50 mb-4 animate-ping">
            <CheckCircleFilled className="text-4xl text-yellow-600" />
          </div>
          <Title level={2} className="mb-2">
            Đặt hàng thành công
          </Title>
          <Text className="text-gray-500 block">
            Mã đơn hàng: #{order._id?.slice(-8).toUpperCase()}
          </Text>
          <Text className="text-gray-500 block">
            Ngày đặt: {formatDateOrder(order?.createdAt)}
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Title level={5} className="flex items-center">
                <UserOutlined className="mr-2 text-yellow-600" />
                Thông tin khách hàng
              </Title>
              <Card className="bg-gray-50">
                <div className="space-y-2">
                  <Text className="block text-gray-600">
                    Họ tên: {order?.name}
                  </Text>
                  <Text className="block text-gray-600">
                    <PhoneOutlined className="mr-2" />
                    {order?.phone}
                  </Text>
                </div>
              </Card>
            </div>

            <div>
              <Title level={5} className="flex items-center">
                <EnvironmentOutlined className="mr-2 text-yellow-600" />
                Địa chỉ giao hàng
              </Title>
              <Card className="bg-gray-50">
                <div>
                  <Text className="text-gray-600">
                    Địa chỉ: {order?.province.name}, {order?.district.name},{" "}
                    {order?.ward.name}
                  </Text>
                </div>
                <Text className="text-gray-600">
                  Chi tiết địa chỉ: {order?.address}
                </Text>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Title level={5} className="flex items-center">
                <SafetyCertificateOutlined className="mr-2 text-yellow-600" />
                Chi tiết thanh toán
              </Title>
              <Card className="bg-gray-50">
                <div className="">
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-600">Phương thức:</Text>
                    <Tag color="warning">{order?.paymentMethod}</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-600">Tổng tiền:</Text>
                    <Text strong className="text-2xl text-red-600">
                      {formatPrice(order?.totalAmount)} đ
                    </Text>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Title level={5} className="flex items-center">
                <GiftOutlined className="mr-2 text-yellow-600" />
                Ưu đãi đi kèm
              </Title>
              <Card className="bg-gray-50">
                <div className="flex items-center text-gray-600">
                  <CheckCircleFilled className="text-green-500 mr-2" />
                  Bảo hành chính hãng 24 tháng
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircleFilled className="text-green-500 mr-2" />
                  Gói bảo dưỡng miễn phí 12 tháng
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const ErrorState = () => (
    <Card className="text-center p-8 shadow-lg bg-white">
      <CloseCircleFilled className="text-6xl text-red-500 mb-4" />
      <Title level={2} className="text-red-600 mb-4">
        {error?.message || "Đặt hàng không thành công"}
      </Title>
      <Text className="text-gray-600 block mb-8">
        Vui lòng kiểm tra lại thông tin và thử lại
      </Text>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin" />
          <div className="mt-4 text-yellow-600">Đang xử lý đơn hàng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {isSuccess && !isEmpty(order) ? (
          <>
            <OrderDetails />
            <OrderTimeline />
          </>
        ) : (
          <ErrorState />
        )}

        <div className="flex justify-center gap-4">
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/")}
            className="min-w-[150px] bg-yellow-600 hover:bg-yellow-500"
          >
            <ShoppingOutlined /> Trang chủ
          </Button>
          <Button
            size="large"
            onClick={() => navigate("/products")}
            className="min-w-[150px] border-yellow-600 text-yellow-600 hover:text-yellow-700 hover:border-yellow-700"
          >
            Tiếp tục mua sắm
          </Button>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <Paragraph>
            Mọi thắc mắc xin vui lòng liên hệ:{" "}
            <Text strong className="text-yellow-600">
              0394194899
            </Text>
          </Paragraph>
          <Paragraph>
            Thời gian làm việc: 8:00 - 22:00 (Thứ 2 - Chủ nhật)
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default OrderReturn;
