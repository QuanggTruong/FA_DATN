import React, { useMemo } from "react";
import { List, Pagination, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../helpers/formatPrice";
import { FaStar, FaShippingFast } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

const ProductCard = ({ item, onClick }) => {
  const discountedPrice = useMemo(
    () => item.price + item.price * 0.3,
    [item.price]
  );

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative pt-[100%] overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Elegant Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* Product Image */}
        <img
          className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
          src={item?.mainImage?.url}
          alt={item.name}
          loading="lazy"
        />

        {/* Status Tags */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {item.tags?.includes("NEW") && (
            <span className="px-3 py-1 bg-black text-white text-xs font-medium tracking-wider">
              NEW
            </span>
          )}
          {item.tags?.includes("HOT") && (
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium tracking-wider">
              HOT
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {item.promotion && (
          <div className="absolute top-3 right-3 z-20">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white text-sm font-bold">
              -{item.promotion.discountPercentage}%
            </span>
          </div>
        )}

        {/* View Detail Button */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0 bg-gradient-to-t from-black/80 to-transparent">
          <button className="w-full py-2 bg-white text-black text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            Xem chi tiết
            <BsArrowRight className="text-lg" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand Name */}
        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          {item.brand?.name}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-medium line-clamp-2 min-h-[40px] truncate-2-lines">
          {item.name}
        </h3>

        {/* Rating */}
        {item.averageRating > 0 && (
          <div className="flex items-center gap-1">
            <FaStar className="text-amber-400 text-sm" />
            <span className="text-sm font-medium">
              {item.averageRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-between flex-wrap">
            <span className="text-lg font-bold">
              {formatPrice(item.price)}đ
            </span>
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(discountedPrice)}đ
            </span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <FaShippingFast className="text-emerald-600" />
            Free Shipping
          </span>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center flex-shrink-0">
            <span className="w-1 h-1 bg-emerald-500 rounded-full mr-1"></span>
            {item.totalQuantity > 0 ? "Còn hàng" : "Hết hàng"}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProductList = ({
  products = [],
  title = "",
  setPagination,
  pagination = {
    page: 1,
    pageSize: 12,
    totalPage: 0,
    totalItems: 0,
  },
  isPagination = true,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const gridConfig = {
    gutter: [16, 24],
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 4,
    xxl: 4,
  };

  const handleChangePage = (key, value) => {
    setPagination?.((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="mt-8">
      {/* Section Title */}
      {title && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">
            {title}
          </h2>
          <div className="mt-2 w-20 h-1 bg-black mx-auto" />
        </div>
      )}

      {/* Products Grid */}
      <List
        grid={gridConfig}
        dataSource={products}
        locale={{
          emptyText: (
            <div className="text-center py-12 text-gray-500">
              Không có sản phẩm !
            </div>
          ),
        }}
        renderItem={(item) => (
          <List.Item>
            <ProductCard
              item={item}
              onClick={() => navigate(`/detail/${item.slug}`)}
            />
          </List.Item>
        )}
      />

      {/* Pagination */}
      {products?.length > 0 && pagination.totalPage > 1 && isPagination && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.totalItems}
            onChange={(page) => handleChangePage("page", page)}
            onShowSizeChange={(_, size) => handleChangePage("pageSize", size)}
            showSizeChanger={false}
            className="shadow-sm"
            responsive
          />
        </div>
      )}
    </section>
  );
};

export default ProductList;
