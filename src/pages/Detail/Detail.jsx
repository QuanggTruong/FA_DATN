import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  Image,
  InputNumber,
  notification,
  Spin,
  Empty,
  Carousel,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { FaTruck, FaShieldAlt, FaUndoAlt, FaCertificate } from "react-icons/fa";
import { motion } from "framer-motion";
import isEmpty from "lodash/isEmpty";
import { getDetailProduct } from "../../redux/product/product.thunk";
import { addToCart } from "../../redux/cart/cart.slice";
import { formatPrice } from "../../helpers/formatPrice";
import confetti from "canvas-confetti";
import RateList from "../../components/RateList";
import ProductOther from "../../components/ProductOther";

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productDetail, isLoading } = useSelector((state) => state.product);
  const [product, setProduct] = useState({
    productId: "",
    name: "",
    image: "",
    price: "",
    quantity: 1,
  });

  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      dispatch(getDetailProduct(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (!isEmpty(productDetail)) {
      setProduct((prev) => ({
        ...prev,
        productId: productDetail._id,
        name: productDetail.name,
        image: productDetail.mainImage.url,
        price: productDetail.price,
      }));
    }
  }, [productDetail]);

  const handleAddToCart = () => {
    if (
      productDetail.totalQuantity &&
      product.quantity > productDetail.totalQuantity
    ) {
      notification.warning({
        message: "Số lượng vượt quá tồn kho",
        placement: "top",
      });
      return;
    }

    dispatch(addToCart(product));
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    notification.success({
      message: "Thêm vào giỏ hàng thành công",
      description: (
        <div className="flex items-center gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="font-bold text-[#d1402c]">
              {formatPrice(product.price)}đ
            </p>
            <p className="font-medium">Số lượng: {product.quantity}</p>
          </div>
        </div>
      ),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isEmpty(productDetail)) return <Empty className="mt-24" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        className="mb-8"
        items={[
          { title: "Trang chủ" },
          { title: "Chi tiết sản phẩm" },
          { title: productDetail.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="product-images">
          <div className="relative h-[550px] mb-4">
            <Carousel autoplay arrows className="h-full rounded-lg bg-gray-50">
              {productDetail.images.map((image, index) => (
                <div key={index} className="h-[550px] rounded-lg">
                  <img
                    src={image.url}
                    alt={`Product-${index}`}
                    className="w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="flex justify-center space-x-2 overflow-x-auto py-2">
            <Image.PreviewGroup>
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  width={80}
                  height={80}
                  src={productDetail.mainImage.url}
                  alt="Main Product"
                  className="object-cover w-full h-full"
                />
              </div>
              {productDetail.images.map((image, index) => (
                <div
                  key={index}
                  className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                >
                  <Image
                    width={80}
                    height={80}
                    src={image.url}
                    alt={`Product-${index}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </Image.PreviewGroup>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {productDetail.name}
            </h1>
            <div className="text-3xl font-bold text-[#d1402c]">
              {formatPrice(product.price)}đ
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng
              </label>
              <InputNumber
                min={1}
                max={productDetail.totalQuantity || 999}
                value={product.quantity}
                onChange={(value) =>
                  setProduct((prev) => ({ ...prev, quantity: value }))
                }
                className="w-32"
              />
            </div>

            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-900 transition-all"
              >
                <ShoppingCartOutlined /> Thêm vào giỏ hàng
              </motion.button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <FaTruck className="text-2xl text-blue-600" />
                <div>
                  <h3 className="font-medium">Miễn phí vận chuyển</h3>
                  <p className="text-sm text-gray-500">Cho đơn từ 500k</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-2xl text-blue-600" />
                <div>
                  <h3 className="font-medium">Bảo hành 12 tháng</h3>
                  <p className="text-sm text-gray-500">Chính hãng</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUndoAlt className="text-2xl text-blue-600" />
                <div>
                  <h3 className="font-medium">Đổi trả miễn phí</h3>
                  <p className="text-sm text-gray-500">Trong 30 ngày</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCertificate className="text-2xl text-blue-600" />
                <div>
                  <h3 className="font-medium">Sản phẩm chính hãng</h3>
                  <p className="text-sm text-gray-500">100% authentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold uppercase mb-2">Mô tả sản phẩm</h2>
        <div className="max-w-none bg-white rounded-2xl text-gray-700 p-3">
          <div
            dangerouslySetInnerHTML={{ __html: productDetail.description }}
          />
        </div>
      </div>

      <div className="mt-12">
        <RateList {...{ product: productDetail }} />
      </div>
      <ProductOther />
    </div>
  );
};

export default Detail;
