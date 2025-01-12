import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProductList from "../../components/ProductList";
import Banner from "../../components/Banner";
import {
  getProductNew,
  getProductHot,
  getProductSale,
  getProductSelling,
} from "../../redux/product/product.thunk";

import {
  RiTimeLine,
  RiTruckLine,
  RiExchangeLine,
  RiShieldCheckLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

const HomePage = () => {
  const dispatch = useDispatch();

  const [productNews, setProductNews] = useState([]);
  const [paginateNew, setPaginateNew] = useState({
    page: 1,
    pageSize: 8,
    totalPage: 0,
    totalItems: 0,
  });

  const [productHots, setProductHots] = useState([]);
  const [paginateHot, setPaginateHot] = useState({
    page: 1,
    pageSize: 8,
    totalPage: 0,
    totalItems: 0,
  });

  const [productSales, setProductSales] = useState([]);
  const [paginateSale, setPaginateSale] = useState({
    page: 1,
    pageSize: 8,
    totalPage: 0,
    totalItems: 0,
  });

  const [productSellings, setProductSellings] = useState([]);
  const [paginateSelling, setPaginateSelling] = useState({
    page: 1,
    pageSize: 8,
    totalPage: 0,
    totalItems: 0,
  });

  const [loading, setLoading] = useState({
    new: false,
    hot: false,
    sale: false,
    selling: false,
  });

  const fetchProductNew = async () => {
    setLoading((prev) => ({ ...prev, new: true }));
    try {
      const response = await dispatch(
        getProductNew({
          page: paginateNew.page,
          pageSize: paginateNew.pageSize,
        })
      ).unwrap();

      if (response.success) {
        setProductNews(response.data.products);
        setPaginateNew((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      }
    } catch (error) {
      console.error("Error fetching new products:", error);
    } finally {
      setLoading((prev) => ({ ...prev, new: false }));
    }
  };
  const fetchProductHot = async () => {
    setLoading((prev) => ({ ...prev, hot: true }));
    try {
      const response = await dispatch(
        getProductHot({
          page: paginateHot.page,
          pageSize: paginateHot.pageSize,
        })
      ).unwrap();

      if (response.success) {
        setProductHots(response.data.products);
        setPaginateHot((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      }
    } catch (error) {
      console.error("Error fetching hot products:", error);
    } finally {
      setLoading((prev) => ({ ...prev, hot: false }));
    }
  };

  const fetchProductSale = async () => {
    setLoading((prev) => ({ ...prev, sale: true }));
    try {
      const response = await dispatch(
        getProductSale({
          page: paginateSale.page,
          pageSize: paginateSale.pageSize,
        })
      ).unwrap();

      if (response.success) {
        setProductSales(response.data.products);
        setPaginateSale((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      }
    } catch (error) {
      console.error("Error fetching sale products:", error);
    } finally {
      setLoading((prev) => ({ ...prev, sale: false }));
    }
  };

  const fetchProductSelling = async () => {
    setLoading((prev) => ({ ...prev, selling: true }));
    try {
      const response = await dispatch(
        getProductSelling({
          page: paginateSelling.page,
          pageSize: paginateSelling.pageSize,
        })
      ).unwrap();

      if (response.success) {
        setProductSellings(response.data.products);
        setPaginateSelling((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      }
    } catch (error) {
      console.error("Error fetching selling products:", error);
    } finally {
      setLoading((prev) => ({ ...prev, selling: false }));
    }
  };

  useEffect(() => {
    fetchProductNew();
  }, [paginateNew.page, paginateNew.pageSize]);

  useEffect(() => {
    fetchProductHot();
  }, [paginateHot.page, paginateHot.pageSize]);

  useEffect(() => {
    fetchProductSale();
  }, [paginateSale.page, paginateSale.pageSize]);

  useEffect(() => {
    fetchProductSelling();
  }, [paginateSelling.page, paginateSelling.pageSize]);

  const PolicyHighlights = () => {
    const policies = [
      {
        icon: <RiTimeLine className="text-2xl" />,
        title: "Mẫu mã đa dạng nhất",
        description: "Hoàn tiền nếu phát hiện bán hàng giả",
        bgColor: "bg-amber-400",
      },
      {
        icon: <RiTruckLine className="text-2xl" />,
        title: "Miễn phí vận chuyển",
        description: "Giao hàng nhanh, đóng gói cẩn thận",
        bgColor: "bg-amber-400",
      },
      {
        icon: <RiExchangeLine className="text-2xl" />,
        title: "Đổi hàng 7 ngày",
        description: "1 đổi 1 trong 7 ngày với sản phẩm lỗi",
        bgColor: "bg-amber-400",
      },
      {
        icon: <RiShieldCheckLine className="text-2xl" />,
        title: "Bảo hành 5 năm",
        description: "Thủ tục nhanh gọn, thay pin miễn phí",
        bgColor: "bg-amber-400",
      },
      {
        icon: <RiMoneyDollarCircleLine className="text-2xl" />,
        title: "Dùng trước trả sau",
        description: "Trả trước 1 phần, 2 phần còn lại trả sau",
        bgColor: "bg-amber-400",
      },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
        {policies.map((policy, index) => (
          <div
            key={index}
            className="flex items-start gap-3 group cursor-pointer p-4 rounded-lg transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100"
          >
            <div
              className={`${policy.bgColor} text-white p-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow`}
            >
              {policy.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-neutral-800 mb-1 line-clamp-1">
                {policy.title}
              </h3>
              <p className="text-sm text-neutral-600 line-clamp-2">
                {policy.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Banner />
      {<PolicyHighlights />}
      {productNews.length > 0 && (
        <ProductList
          title="Sản phẩm mới"
          products={productNews}
          pagination={paginateNew}
          setPagination={setPaginateNew}
          isLoading={loading.new}
        />
      )}

      {productHots.length > 0 && (
        <ProductList
          title="Sản phẩm nổi bật"
          products={productHots}
          pagination={paginateHot}
          setPagination={setPaginateHot}
          isLoading={loading.hot}
        />
      )}

      {productSales.length > 0 && (
        <ProductList
          title="Sản phẩm giảm giá"
          products={productSales}
          pagination={paginateSale}
          setPagination={setPaginateSale}
          isLoading={loading.sale}
        />
      )}

      {productSales.length > 0 && (
        <ProductList
          title="Sản phẩm bán chạy"
          products={productSellings}
          pagination={paginateSelling}
          setPagination={setPaginateSelling}
          isLoading={loading.selling}
        />
      )}
    </>
  );
};

export default HomePage;
