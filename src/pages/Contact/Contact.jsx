import React from "react";
import { Breadcrumb, Form, Input, message } from "antd";
import { IoIosSend } from "react-icons/io";
import {
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createContact } from "../../redux/contact/contact.thunk";

const Contact = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { address } = useSelector((state) => state.setting);

  const handleSubmitContact = async (values) => {
    const res = await dispatch(createContact(values)).unwrap();
    if (res.success) {
      message.success(res.message);
      form.resetFields();
    }
  };

  const contactInfo = [
    {
      icon: <PhoneOutlined className="text-2xl" />,
      title: "Điện thoại",
      content: "0394194899",
      subtitle: "Hỗ trợ 24/7",
    },
    {
      icon: <EnvironmentOutlined className="text-2xl" />,
      title: "Địa chỉ",
      content: "223 Quan Hoa",
      subtitle: "Cầu giấy, Hà Nội",
    },
    {
      icon: <MailOutlined className="text-2xl" />,
      title: "Email",
      content: "support@senaquatic.com",
      subtitle: "Phản hồi trong 24h",
    },
    {
      icon: <ClockCircleOutlined className="text-2xl" />,
      title: "Giờ làm việc",
      content: "Thứ 2 - Chủ nhật",
      subtitle: "8:00 - 22:00",
    },
  ];

  return (
    <>
      <Breadcrumb
        className="py-4"
        items={[{ title: "Trang chủ" }, { title: "Liên hệ" }]}
      />
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Contact Info Cards */}
          {!address && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-yellow-600 font-semibold">
                        {item.content}
                      </p>
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageOutlined className="text-yellow-600" />
                Gửi tin nhắn cho chúng tôi
              </h2>

              {address && (
                <div
                  dangerouslySetInnerHTML={{ __html: address }}
                  className="prose max-w-none mb-6 text-gray-600"
                />
              )}

              <Form
                form={form}
                onFinish={handleSubmitContact}
                layout="vertical"
                className="space-y-4"
              >
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng điền họ và tên" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    size="large"
                    placeholder="Nhập họ và tên của bạn"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng điền email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    size="large"
                    placeholder="Nhập địa chỉ email của bạn"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name="message"
                  rules={[
                    { required: true, message: "Vui lòng điền nội dung" },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Nhập nội dung tin nhắn"
                    rows={6}
                    className="rounded-lg resize-none"
                  />
                </Form.Item>

                <Form.Item>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <IoIosSend className="text-xl" />
                    Gửi tin nhắn
                  </button>
                </Form.Item>
              </Form>
            </div>

            {/* Map */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <EnvironmentOutlined className="text-yellow-600" />
                Vị trí của chúng tôi
              </h2>
              <div className="rounded-lg overflow-hidden h-[500px] shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4417.276839246093!2d105.80322137584143!3d21.036870787498867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab1563eb7cc9%3A0x860f62a0ba8655db!2zMjIzIFAuIFF1YW4gSG9hLCBRdWFuIEhvYSwgQ-G6p3UgR2nhuqV5LCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e1!3m2!1svi!2s!4v1736413122371!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
