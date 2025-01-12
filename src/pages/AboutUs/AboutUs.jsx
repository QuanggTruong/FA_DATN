import { Breadcrumb, Card } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const AboutUs = () => {
  const { aboutUs } = useSelector((state) => state.setting);
  return (
    <>
      <Breadcrumb
        className="py-2"
        items={[{ title: "Trang chủ" }, { title: "Giới thiệu" }]}
      />
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="font-medium text-lg uppercase">
          Thông tin giới thiệu
        </div>
        {aboutUs && (
          <div
            dangerouslySetInnerHTML={{ __html: aboutUs }}
            className="prose max-w-none py-4 space-y-4"
          />
        )}
      </Card>
    </>
  );
};

export default AboutUs;
