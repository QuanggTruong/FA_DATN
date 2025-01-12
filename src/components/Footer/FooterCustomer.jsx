import React from "react";
import { Layout, Typography, Divider, Space } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import logo from "../../resources/logo2.webp";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const FooterCustomer = () => {
  return (
    <Footer className="bg-white pt-12 pb-6 border-t-2 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <img src={logo} alt="Logo" className="h-auto w-32 mb-4" />
            <Text className="text-gray-600">
              Chúng tôi cung cấp các sản phẩm đèn trang trí cao cấp, mang đến
              những giây phú đắm mình vào không gian thủy sinh hoàn hảo cho ngôi nhà của bạn.
            </Text>
            <div className="mt-4">
              <Space direction="vertical" size="small">
                <div className="flex items-center gap-2">
                  <EnvironmentOutlined className="text-primary-600" />
                  <Text>223 QUAN HOA, CẦU GIẤY, HÀ NỘI</Text>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneOutlined className="text-primary-600" />
                  <Text>0394 194 899</Text>
                </div>
                <div className="flex items-center gap-2">
                  <MailOutlined className="text-primary-600" />
                  <Text>contact@senaquatic.com</Text>
                </div>
                <div className="flex items-center gap-2">
                  <GlobalOutlined className="text-primary-600" />
                  <Text>www.senaquatic.com</Text>
                </div>
              </Space>
            </div>
          </div>

          {/* About Us */}
          <div className="col-span-1">
            <Title level={4} className="mb-4">
              Về chúng tôi
            </Title>
            <Space direction="vertical" size="middle" className="w-full">
              <Link className="text-gray-600 hover:text-primary-600">
                Trang chủ
              </Link>
              <Link className="text-gray-600 hover:text-primary-600">
                Tất cả sản phẩm
              </Link>
              <Link className="text-gray-600 hover:text-primary-600">
                Kiểm tra đơn hàng
              </Link>
              <Link className="text-gray-600 hover:text-primary-600">
                Hệ Thống Cửa Hàng
              </Link>
            </Space>
          </div>

          {/* Policy */}
          <div className="col-span-1">
            <Title level={4} className="mb-4">
              Chính sách
            </Title>
            <Space direction="vertical" size="middle" className="w-full">
              <Link className="text-gray-600 hover:text-primary-600">
                Chính sách mua hàng
              </Link>
              <Link className="text-gray-600 hover:text-primary-600">
                Chính sách bảo mật
              </Link>
              <Link className="text-gray-600 hover:text-primary-600">
                Phương thức thanh toán
              </Link>
              <Link className="text-gray-600 hover:text-primary-600">
                Chính sách giao nhận
              </Link>
              <Link className="text-gray-600 hover:text-primary-600">
                Chính sách đổi trả
              </Link>
            </Space>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <Title level={4} className="mb-4">
              Kết nối với chúng tôi
            </Title>
            <Text className="text-gray-600 mb-4 block">
              Theo dõi chúng tôi trên các mạng xã hội để nhận thông tin mới nhất
            </Text>
            <Space size="large" className="mt-4">
              <Link href="https://facebook.com" target="_blank">
                <FacebookOutlined className="text-2xl hover:text-primary-600 transition-colors" />
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <InstagramOutlined className="text-2xl hover:text-primary-600 transition-colors" />
              </Link>
              <Link href="https://twitter.com" target="_blank">
                <TwitterOutlined className="text-2xl hover:text-primary-600 transition-colors" />
              </Link>
            </Space>
          </div>
        </div>

        {/* Footer Bottom */}
        <Divider className="my-6" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Text className="text-gray-600">
            © {new Date().getFullYear()} Hilight. Tất cả quyền được bảo lưu.
          </Text>
          <Space split={<Divider type="vertical" />} className="mt-4 md:mt-0">
            <Link className="text-gray-600 hover:text-primary-600">
              Điều khoản sử dụng
            </Link>
            <Link className="text-gray-600 hover:text-primary-600">
              Chính sách bảo mật
            </Link>
          </Space>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCustomer;
