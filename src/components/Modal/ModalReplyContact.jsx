import { Form, Input, message, Modal } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getContactList,
  replyContact,
} from "../../redux/contact/contact.thunk";

const ModalReplyContact = ({ open, setOpen, item }) => {
  const [form] = Form.useForm();
  const { pagination } = useSelector((state) => state.contact);
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    const res = await dispatch(
      replyContact({
        id: item._id,
        data: {
          ...values,
        },
      })
    ).unwrap();
    if (res.success) {
      message.success(res.message);
      dispatch(getContactList({ ...pagination }));
      form.resetFields();
      setOpen(false);
    }
  };
  return (
    <Modal
      open={open}
      title="Phản hồi thông tin liên hệ"
      onCancel={() => {
        form.resetFields();
        setOpen(false);
      }}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="reply"
          label="Nội dung"
          className="w-full lg:flex-1"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Nhập nội dung phản hổi"
            allowClear
          />
        </Form.Item>

        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              form.resetFields();
              setOpen(false);
            }}
            type="button"
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 border px-6 py-2 rounded-full transition duration-300 ease-in-out"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-500 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2"
          >
            Gửi ngay
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalReplyContact;
