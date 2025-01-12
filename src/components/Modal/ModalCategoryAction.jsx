import { Form, Input, message, Modal, Select } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  getCategoryAdmin,
  getCategoryList,
  updateCategory,
} from "../../redux/category/category.thunk";

const ModalCategoryAction = ({ open, setOpen, category = null }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    isLoading,
    categoriesAll: categories,
    pagination,
  } = useSelector((state) => state.category);
  const [initData, setInitData] = useState({
    name: "",
    parent: null,
    type: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setInitData({
        name: category.name,
        parent: category.parent,
        type: category.type,
      });
      form.setFieldsValue({
        name: category.name || "",
        parent: category.parent || null,
        type: category.type || "",
      });
    }
  }, [category, form]);

  useEffect(() => {
    if (open) {
      dispatch(getCategoryAdmin());
    }
  }, [open]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        parent: values.parent || null,
      };

      const action = category
        ? updateCategory({ id: category._id, data: payload })
        : createCategory(payload);

      const result = await dispatch(action).unwrap();

      if (result.success) {
        message.success(result.message);
        dispatch(getCategoryList({ ...pagination }));
        setOpen(false);
        form.resetFields();
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div className="text-lg md:text-2xl font-bold text-center">
          {!category ? "Thêm mới danh mục" : "Cập nhật danh mục"}
        </div>
      }
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initData}
      >
        <Form.Item
          name="type"
          label="Loại danh mục"
          className="w-full lg:flex-1"
          rules={[{ required: true, message: "Vui chọn loại danh mục" }]}
        >
          <Select size="large" placeholder="Chọn loại danh mục" allowClear>
            <Select.Option value={"wear"}>Động vật thủy sinh</Select.Option>
            <Select.Option value={"decorate"}>Thực vật thủy sinh</Select.Option>
            <Select.Option value={"extra"}>Phụ kiện thủy sinh</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          disabled
          name="parent"
          label="Danh mục (0)"
          className="w-full lg:flex-1"
        >
          <Select
            disabled={category && category.level === 0}
            size="large"
            placeholder="Chọn danh mục (0)"
            allowClear
          >
            {!isLoading &&
              categories?.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên danh mục"
          className="w-full lg:flex-1"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input
            size="large"
            placeholder="Nhập tên danh mục"
            className="w-full lg:flex-1 rounded-lg border-[#d9d9d9]"
            allowClear
          />
        </Form.Item>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              if (!category) {
                setName("");
              }
            }}
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 border px-6 py-2 rounded-full transition duration-300 ease-in-out"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2"
          >
            {loading ? "Đang tải..." : !category ? "Thêm" : "Cập nhật"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCategoryAction;
