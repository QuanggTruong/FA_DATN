import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Breadcrumb, Empty, notification } from "antd";
import { formatPrice } from "../../helpers/formatPrice";
import ModalCheckOut from "../../components/Modal/ModalCheckOut";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../../redux/cart/cart.slice";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaShoppingBag } from "react-icons/fa";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { MdOutlineSecurity } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import CartIcon from "../../components/CartIcon";
import ProductOther from "../../components/ProductOther";

const Cart = ({ isTitle = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, totalAmount } = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const handleIncrement = (productId) => {
    dispatch(incrementQuantity({ productId }));
  };

  const handleDecrement = (productId) => {
    dispatch(decrementQuantity({ productId }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ productId }));
    notification.success({
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      placement: "top",
    });
  };

  if (products.length === 0) {
    return (
      <>
        {isTitle && (
          <Breadcrumb
            className="py-2"
            items={[{ title: "Trang chủ" }, { title: "Giỏ hàng" }]}
          />
        )}
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <Empty
              description={
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Giỏ hàng trống
                  </h2>
                  <p className="text-gray-500">
                    Hãy thêm một số sản phẩm vào giỏ hàng của bạn và quay lại
                    đây nhé!
                  </p>
                </div>
              }
            />
            <div className="flex items-center justify-center">
              <button
                onClick={() => navigate("/")}
                className="mt-6 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <FaShoppingBag />
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
        {isTitle && <ProductOther />}
      </>
    );
  }

  return (
    <>
      {isTitle && (
        <Breadcrumb
          className="py-2"
          items={[{ title: "Trang chủ" }, { title: "Giỏ hàng" }]}
        />
      )}
      <div className="bg-gray-50 p-6 rounded-md">
        <ModalCheckOut
          open={open}
          setOpen={setOpen}
          products={products}
          totalAmount={totalAmount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2 uppercase">
                  <CartIcon /> Giỏ hàng của bạn 
                </h2>
              </div>
              <div className="divide-y">
                {products.map((item) => (
                  <div key={item.productId} className="p-6 hover:bg-gray-50">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="text-base font-semibold text-red-500">
                          {formatPrice(item.price)}đ
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrashAlt />
                        </button>
                        <div className="flex items-center gap-3 select-none">
                          <button
                            onClick={() => handleDecrement(item.productId)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <IoMdRemove />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item.productId)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <IoMdAdd />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary and Checkout */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Tổng đơn hàng</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    {formatPrice(totalAmount)}đ
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">Miễn phí</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold">Tổng cộng:</span>
                    <span className="font-bold text-red-500">
                      {formatPrice(totalAmount)}đ
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/auth");
                    return;
                  }
                  setOpen(true);
                }}
                className="w-full mt-6 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-lg font-medium"
              >
                <FaShoppingBag /> Thanh toán ngay
              </button>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold mb-4">Quyền lợi khách hàng</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <TbTruckDelivery className="text-2xl text-green-500" />
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MdOutlineSecurity className="text-2xl text-blue-500" />
                  <span>Bảo hành chính hãng 12 tháng</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <BiSupport className="text-2xl text-purple-500" />
                  <span>Hỗ trợ kỹ thuật 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isTitle && <ProductOther />}
    </>
  );
};

export default Cart;
