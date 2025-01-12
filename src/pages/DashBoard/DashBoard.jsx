import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Skeleton } from "antd";
import { getStatisticalAdmin } from "../../redux/statistical/statistical.thunk";
import { formatPrice } from "../../helpers/formatPrice";
import {
  MdShoppingCart,
  MdPerson,
  MdInventory,
  MdAttachMoney,
} from "react-icons/md";
import StatisicalRevenue from "../../components/StatisicalRevenue";
import StatisticalProductSelling from "../../components/StatisticalProductSelling";

const StatCard = ({ title, value, icon, bgColor, textColor, isLoading }) => (
  <Card
    className="w-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    bordered={false}
  >
    {isLoading ? (
      <Skeleton active paragraph={{ rows: 1 }} />
    ) : (
      <div className="text-base">
        <div className="font-bold flex justify-between items-center mb-3">
          <div className="text-gray-700">{title}</div>
          <div className={`${bgColor} rounded-lg p-2 shadow-md`}>{icon}</div>
        </div>
        <div className={`font-bold text-2xl ${textColor} tracking-wide`}>
          {value}
        </div>
      </div>
    )}
  </Card>
);

const DashBoard = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    totalOrders,
    totalProducts,
    totalCustomers,
    totalOrderAmount,
    monthlyRevenue,
    topSellingProducts,
  } = useSelector((state) => state.statistical);

  useEffect(() => {
    dispatch(getStatisticalAdmin());
  }, [dispatch]);

  const stats = [
    {
      title: "Tổng đơn hàng",
      value: totalOrders,
      bgColor: "bg-emerald-500",
      textColor: "text-emerald-600",
      icon: <MdShoppingCart className="w-6 h-6 text-white" />,
    },
    {
      title: "Tổng tiền đơn hàng",
      value: `${formatPrice(totalOrderAmount)} VND`,
      bgColor: "bg-blue-500",
      textColor: "text-blue-600",
      icon: <MdAttachMoney className="w-6 h-6 text-white" />,
    },
    {
      title: "Tổng khách hàng",
      value: totalCustomers,
      bgColor: "bg-orange-500",
      textColor: "text-orange-600",
      icon: <MdPerson className="w-6 h-6 text-white" />,
    },
    {
      title: "Tổng sản phẩm",
      value: totalProducts,
      bgColor: "bg-purple-500",
      textColor: "text-purple-600",
      icon: <MdInventory className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-3">
          <Card
            className="hover:shadow-lg transition-all duration-300"
            bordered={false}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Thống kê doanh thu
            </h2>
            <StatisicalRevenue
              monthlyRevenue={monthlyRevenue}
              isLoading={isLoading}
            />
          </Card>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-2">
          <Card
            className="hover:shadow-lg transition-all duration-300"
            bordered={false}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Sản phẩm bán chạy
            </h2>
            <StatisticalProductSelling
              topSellingProducts={topSellingProducts}
              isLoading={isLoading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
