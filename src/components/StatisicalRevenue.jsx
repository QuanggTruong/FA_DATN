import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { formatPrice } from "../helpers/formatPrice";
import { Spin } from "antd";

const StatisicalRevenue = ({ monthlyRevenue, isLoading }) => {
  const series = useMemo(() => {
    const revenueData = new Array(12).fill(0);
    if (Array.isArray(monthlyRevenue) && monthlyRevenue.length > 0) {
      monthlyRevenue.forEach((item) => {
        if (
          item &&
          typeof item._id === "number" &&
          item._id >= 1 &&
          item._id <= 12
        ) {
          revenueData[item._id - 1] = item.revenue || 0;
        }
      });
    }
    return [
      {
        name: "Doanh thu",
        data: revenueData,
      },
    ];
  }, [monthlyRevenue]);

  const options = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatPrice(val) + " VND";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: [
        "Th1",
        "Th2",
        "Th3",
        "Th4",
        "Th5",
        "Th6",
        "Th7",
        "Th8",
        "Th9",
        "Th10",
        "Th11",
        "Th12",
      ],
      position: "top",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return formatPrice(val) + " VND";
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatPrice(val) + " VND";
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

  if (!Array.isArray(monthlyRevenue) || monthlyRevenue.length === 0) {
    return <div>Không có dữ liệu doanh thu.</div>;
  }

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default StatisicalRevenue;
