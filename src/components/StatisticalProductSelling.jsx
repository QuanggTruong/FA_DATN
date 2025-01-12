import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Spin } from "antd";

const StatisticalProductSelling = ({ topSellingProducts, isLoading }) => {
  const { series, categories } = useMemo(() => {
    if (!Array.isArray(topSellingProducts) || topSellingProducts.length === 0) {
      return { series: [{ data: [] }], categories: [] };
    }

    const sortedProducts = [...topSellingProducts].sort(
      (a, b) => b.totalSold - a.totalSold
    );
    const data = sortedProducts.map((product) => product.totalSold);
    const categories = sortedProducts.map((product) => product.name);

    return { series: [{ data }], categories };
  }, [topSellingProducts]);

  const options = {
    chart: {
      type: "bar",
      height: 380,
    },
    plotOptions: {
      bar: {
        barHeight: "100%",
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: "bottom",
        },
      },
    },
    colors: [
      "#33b2df",
      "#546E7A",
      "#d4526e",
      "#13d8aa",
      "#A5978B",
      "#2b908f",
      "#f9a3a4",
      "#90ee7e",
      "#f48024",
      "#69d2e7",
    ],
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["#fff"],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ": " + val;
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
        formatter: function (val) {
          return val + " sản phẩm";
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="py-4 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!Array.isArray(topSellingProducts) || topSellingProducts.length === 0) {
    return <div>Không có dữ liệu sản phẩm bán chạy.</div>;
  }

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={380}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default StatisticalProductSelling;
