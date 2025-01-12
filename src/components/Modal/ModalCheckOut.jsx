import React, { useEffect, useState } from "react";
import { Collapse, Modal } from "antd";
import { formatPrice } from "../../helpers/formatPrice";
import useScreen from "../../hook/useScreen";
import { useDispatch, useSelector } from "react-redux";
import { getDistrict, getProvince, getWard } from "../../redux/ship/ship.thunk";
import {
  orderCod,
  orderStripe,
  orderVnpay,
} from "../../redux/order/order.thunk";
import { FaCreditCard } from "react-icons/fa";
import { SiStripe } from "react-icons/si";
import { GiTakeMyMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { setOrderReturn } from "../../redux/order/order.slice";
import { loadStripe } from "@stripe/stripe-js";
import { clearCart } from "../../redux/cart/cart.slice";
import { validateForm, validateOrderSchema } from "../../validate/validate";
import ErrorValidate from "../Notification/ErrorValidate";
import { setDistrict, setWard } from "../../redux/ship/ship.slice";

import {
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY;

const ModalCheckOut = ({ open, setOpen, products = [], totalAmount = 0 }) => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { provinces, districts, wards } = useSelector((state) => state.ship);
  const [order, setOrder] = useState({
    name: "",
    products:
      products?.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
      })) || [],
    phone: "",
    address: "",
    province: { id: "", name: "" },
    district: { id: "", name: "" },
    ward: { id: "", name: "" },
    note: "",
    paymentMethod: "COD",
    totalAmount,
  });
  const [validates, setValidates] = useState({});

  useEffect(() => {
    dispatch(getProvince());
  }, []);

  useEffect(() => {
    if (order.province.id) {
      dispatch(getDistrict(order.province.id));
    }
  }, [order.province.id]);

  useEffect(() => {
    if (order.district.id) {
      dispatch(getWard(order.district.id));
    }
  }, [order.district.id]);

  const handleChangeOrder = (key, value) => {
    setOrder((prev) => ({ ...prev, [key]: value }));
  };

  const clearOrder = () => {
    setOrder((prev) => ({
      ...prev,
      name: "",
      products:
        products?.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
        })) || [],
      phone: "",
      address: "",
      province: { id: "", name: "" },
      district: { id: "", name: "" },
      ward: { id: "", name: "" },
      note: "",
      paymentMethod: "COD",
      totalAmount,
    }));
    setValidates({});
    dispatch(setDistrict([]));
    dispatch(setWard([]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    const validationErrors = await validateForm({
      input: order,
      validateSchema: validateOrderSchema,
    });
    if (Object.keys(validationErrors).length > 0) {
      setValidates(validationErrors);
      return;
    }
    switch (order.paymentMethod) {
      case "COD":
        return dispatch(orderCod(order)).then((res) => {
          if (res.payload.success) {
            dispatch(setOrderReturn(res.payload.data));
            navigate(`/order-return`);
            dispatch(clearCart());
          }
        });
      case "VNPAY":
        return dispatch(orderVnpay(order)).then((res) => {
          if (res.payload.success) {
            window.location.href = res.payload.data;
          }
        });
      case "STRIPE":
        const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
        dispatch(orderStripe(order)).then(async (res) => {
          if (res.payload.success) {
            await stripe.redirectToCheckout({
              sessionId: res.payload.id,
            });
          }
        });
        break;
      default:
        break;
    }
  };
  const CartOrder = () => (
    <div className="w-full my-4 max-h-[60vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
      {products.map((item, index) => (
        <div
          key={`cart-item-modal-${index}`}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-100"
        >
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0">
              <img
                className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                src={item?.image}
                alt={item.name}
              />
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-800 line-clamp-2">
                {item.name}
              </h3>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Đơn giá: {formatPrice(item.price)}đ
                </span>
                <span className="text-base font-bold text-red-500">
                  {formatPrice(item.quantity * item.price)}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Modal
        className="luxury-checkout-modal"
        width={isMobile ? "100%" : "900px"}
        open={open}
        title={
          <div className="flex items-center gap-2 py-3 border-b border-gray-100">
            <ClockCircleOutlined className="text-xl text-yellow-600" />
            <span className="text-xl font-semibold">Thông tin đặt hàng</span>
          </div>
        }
        onCancel={() => {
          setOpen(false);
          clearOrder();
        }}
        footer={[
          <button
            key="cancel"
            onClick={() => {
              setOpen(false);
              clearOrder();
            }}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>,
          <button
            key="order"
            type="submit"
            onClick={handleSubmit}
            className="mx-2 px-8 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm hover:shadow-md"
          >
            Đặt hàng ngay
          </button>,
        ]}
      >
        <div className="bg-gray-50/50 rounded-lg p-4 mb-6">
          <Collapse
            className="bg-transparent"
            defaultActiveKey={["1"]}
            items={[
              {
                key: "1",
                label: (
                  <div className="flex items-center gap-2 text-base font-medium">
                    <ShoppingOutlined className="text-yellow-600" />
                    Chi tiết đơn hàng ({products.length} sản phẩm)
                  </div>
                ),
                children: <CartOrder />,
              },
            ]}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin khách hàng */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <UserOutlined className="text-yellow-600" />
              Thông tin người nhận
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  className={`w-full px-4 py-2.5 rounded-lg border bg-transparent text-gray-700${
                    validates.name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-colors`}
                  value={order.name}
                  onChange={(e) => handleChangeOrder("name", e.target.value)}
                />
                {validates.name && <ErrorValidate message={validates.name} />}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 bg-transparent">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className={`w-full px-4 py-2.5 rounded-lg border bg-transparent ${
                    validates.phone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-colors`}
                  value={order.phone}
                  onChange={(e) => handleChangeOrder("phone", e.target.value)}
                />
                {validates.phone && <ErrorValidate message={validates.phone} />}
              </div>
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 bg-transparent">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <EnvironmentOutlined className="text-yellow-600" />
              Địa chỉ giao hàng
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tỉnh/Thành phố
                </label>
                <select
                  value={order.province.id}
                  onChange={(e) => {
                    const selected = provinces?.find(
                      (p) => p.ProvinceID === parseInt(e.target.value)
                    );
                    if (selected) {
                      handleChangeOrder("province", {
                        id: selected.ProvinceID,
                        name: selected.ProvinceName,
                      });
                      handleChangeOrder("district", { id: "", name: "" });
                      handleChangeOrder("ward", { id: "", name: "" });
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border bg-transparent ${
                    validates["province.id"]
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-colors`}
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {provinces?.map((item) => (
                    <option key={item.ProvinceID} value={item.ProvinceID}>
                      {item.ProvinceName}
                    </option>
                  ))}
                </select>
                {validates["province.id"] && (
                  <ErrorValidate message={validates["province.id"]} />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện
                  </label>
                  <select
                    disabled={districts?.length === 0}
                    value={order.district.id}
                    onChange={(e) => {
                      const selected = districts?.find(
                        (d) => d.DistrictID === parseInt(e.target.value)
                      );
                      if (selected) {
                        handleChangeOrder("district", {
                          id: selected.DistrictID,
                          name: selected.DistrictName,
                        });
                        handleChangeOrder("ward", { id: "", name: "" });
                      }
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-transparent ${
                      validates["district.id"]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-colors ${
                      districts?.length === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts?.map((item) => (
                      <option key={item.DistrictID} value={item.DistrictID}>
                        {item.DistrictName}
                      </option>
                    ))}
                  </select>
                  {validates["district.id"] && (
                    <ErrorValidate message={validates["district.id"]} />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường/Xã
                  </label>
                  <select
                    disabled={wards?.length === 0}
                    value={order.ward.id}
                    onChange={(e) => {
                      const selected = wards?.find(
                        (w) => w.WardCode === e.target.value
                      );
                      if (selected) {
                        handleChangeOrder("ward", {
                          id: selected.WardCode,
                          name: selected.WardName,
                        });
                      }
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-transparent ${
                      validates["ward.id"]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-colors ${
                      wards?.length === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards?.map((item) => (
                      <option key={item.WardCode} value={item.WardCode}>
                        {item.WardName}
                      </option>
                    ))}
                  </select>
                  {validates["ward.id"] && (
                    <ErrorValidate message={validates["ward.id"]} />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ cụ thể
                </label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường..."
                  className={`w-full px-4 py-2.5 rounded-lg border bg-transparent ${
                    validates.address
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-colors`}
                  value={order.address}
                  onChange={(e) => handleChangeOrder("address", e.target.value)}
                />
                {validates.address && (
                  <ErrorValidate message={validates.address} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows="3"
                  placeholder="Ghi chú thêm về đơn hàng..."
                  className="bg-transparent text-gray-700 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-colors resize-none"
                  value={order.note}
                  onChange={(e) => handleChangeOrder("note", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <CreditCardOutlined className="text-yellow-600" />
              Phương thức thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => handleChangeOrder("paymentMethod", "COD")}
                className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  order.paymentMethod === "COD"
                    ? "bg-yellow-50 border-2 border-yellow-400"
                    : "border border-gray-200 hover:border-yellow-300"
                }`}
              >
                {/* Tiếp tục phần phương thức thanh toán */}
                {order.paymentMethod === "COD" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircleFilled className="text-yellow-500 text-lg" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <GiTakeMyMoney className="text-2xl text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium">COD</div>
                    <div className="text-sm text-gray-500">
                      Thanh toán khi nhận hàng
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleChangeOrder("paymentMethod", "VNPAY")}
                className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  order.paymentMethod === "VNPAY"
                    ? "bg-blue-50 border-2 border-blue-400"
                    : "border border-gray-200 hover:border-blue-300"
                }`}
              >
                {order.paymentMethod === "VNPAY" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircleFilled className="text-blue-500 text-lg" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaCreditCard className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">VNPAY</div>
                    <div className="text-sm text-gray-500">
                      Thanh toán qua VNPay
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleChangeOrder("paymentMethod", "STRIPE")}
                className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  order.paymentMethod === "STRIPE"
                    ? "bg-purple-50 border-2 border-purple-400"
                    : "border border-gray-200 hover:border-purple-300"
                }`}
              >
                {order.paymentMethod === "STRIPE" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircleFilled className="text-purple-500 text-lg" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <SiStripe className="text-xl text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Stripe</div>
                    <div className="text-sm text-gray-500">
                      Thanh toán bằng thẻ quốc tế
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Thông tin đơn hàng */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-600">Tạm tính</span>
                <span className="text-gray-800 font-medium">
                  {formatPrice(totalAmount)}đ
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-gray-800 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-medium text-gray-700">
                  Tổng thanh toán
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-500">
                    {formatPrice(totalAmount)}đ
                  </div>
                  <div className="text-sm text-gray-500">(Đã bao gồm VAT)</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ModalCheckOut;
