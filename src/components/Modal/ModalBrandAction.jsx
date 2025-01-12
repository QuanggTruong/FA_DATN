import { Form, Input, message, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import {
  createBrand,
  getBrandList,
  updateBrand,
} from "../../redux/brand/brand.thunk";
import { PlusOutlined } from "@ant-design/icons";
import { deleteFile, uploadFile } from "../../helpers/uploadCloudinary";

const ModalBrandAction = ({ open, setOpen, brand = {} }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { pagination } = useSelector((state) => state.brand);
  const [image, setImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (brand._id && open) {
      form.setFieldsValue({
        name: brand.name,
        image: brand.image,
      });
      setImage(
        brand.image
          ? [{ url: brand.image.url, publicId: brand.image.publicId }]
          : []
      );
    }
  }, [open, brand._id]);

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setImage([]);
  };

  const uploadImage = async () => {
    if (image[0]?.originFileObj) {
      const result = await uploadFile(image[0].originFileObj);
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }
    return image[0];
  };

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const uploadedImage = await uploadImage();

      const payload = {
        ...values,
        image: uploadedImage,
      };

      let res;
      if (isEmpty(brand)) {
        res = await dispatch(createBrand(payload)).unwrap();
      } else {
        res = await dispatch(updateBrand({ id: brand._id, payload })).unwrap();

        if (res.success && uploadedImage.publicId !== brand.image?.publicId) {
          await deleteFile(brand.image.publicId);
        }
      }

      if (res.success) {
        message.success(res.message);
        dispatch(getBrandList(pagination));
        handleCancel();
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div className="text-lg md:text-2xl font-bold text-center">
          {isEmpty(brand) ? "Thêm mới thương hiệu" : "Cập nhật thương hiệu"}
        </div>
      }
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Form.Item
          name="image"
          className="flex justify-center"
          rules={[{ required: true, message: "Vui lòng chọn ảnh thương hiệu" }]}
        >
          <Upload
            listType="picture-circle"
            beforeUpload={() => false}
            maxCount={1}
            fileList={image}
            onChange={({ fileList }) => {
              setImage(fileList);
            }}
          >
            {image.length < 1 && (
              <div>
                <PlusOutlined />
                <div className="mt-2">Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          name={"name"}
          label="Tên thương hiệu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên thương hiệu",
            },
          ]}
        >
          <Input size="middle" />
        </Form.Item>
        <div className="flex gap-2 items-center justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 border px-6 py-2 rounded-full transition duration-300 ease-in-out"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang tải..." : isEmpty(brand) ? "Thêm" : "Cập nhật"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalBrandAction;
