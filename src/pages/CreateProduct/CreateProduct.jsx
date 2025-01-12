import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Upload,
  Select,
  InputNumber,
  Form,
  Spin,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../helpers/uploadCloudinary";
import { useNavigate } from "react-router-dom";
import { getCategoryAdmin } from "../../redux/category/category.thunk";
import { createProduct } from "../../redux/product/product.thunk";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { getBrandByCreatePro } from "../../redux/brand/brand.thunk";

const CreateProduct = () => {
  const mdParser = new MarkdownIt();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoriesAll: categories } = useSelector((state) => state.category);
  const { brands } = useSelector((state) => state.brand);
  const [loading, setLoading] = useState(false);
  const [mainImageList, setMainImageList] = useState([]);
  const [imagesList, setImagesList] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    dispatch(getCategoryAdmin());
    dispatch(getBrandByCreatePro());
  }, [dispatch]);

  const handleMainImageChange = ({ fileList }) => {
    setMainImageList(fileList);
  };

  const handleImagesChange = ({ fileList }) => {
    setImagesList(fileList);
  };

  const uploadAllImages = async () => {
    let mainImageData = null;
    if (mainImageList[0]?.originFileObj) {
      const mainUploadResult = await uploadFile(mainImageList[0].originFileObj);
      mainImageData = {
        url: mainUploadResult.secure_url,
        publicId: mainUploadResult.public_id,
      };
    }

    const imagesData = await Promise.all(
      imagesList
        .filter((file) => file.originFileObj)
        .map(async (file) => {
          const result = await uploadFile(file.originFileObj);
          return {
            url: result.secure_url,
            publicId: result.public_id,
          };
        })
    );

    return {
      mainImage: mainImageData,
      images: imagesData,
    };
  };

  const handleChangeType = (value) => {
    setType(value);
    if (value) {
      const parentCategories = categories.filter(
        (item) => item.type === value && item.level === 0
      );
      const childCategories = parentCategories
        .flatMap((item) => item.children || [])
        .filter((child) => child.type === value && child.level === 1);
      setParentCategories(parentCategories);
      setChildCategories(childCategories);
    } else {
      setParentCategories([]);
      setChildCategories([]);
    }
  };

  const handleOnFinish = async (values) => {
    try {
      setLoading(true);
      const uploadedImages = await uploadAllImages();

      const parentCategory = values.parentCategory || [];
      const childCategory = values.childCategory || [];

      const finalPayload = {
        ...values,
        categories: [...parentCategory, ...childCategory],
        mainImage: uploadedImages.mainImage,
        images: uploadedImages.images,
      };

      delete finalPayload.parentCategory;
      delete finalPayload.childCategory;

      const res = await dispatch(createProduct(finalPayload)).unwrap();
      if (res.success) {
        message.success(res.message);
        navigate("/admin/products");
      }
      return;
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = ({ html, text }) => {
    form.setFieldsValue({ description: html });
  };

  return (
    <div className="py-6 mx-auto">
      <Card
        title="Tạo sản phẩm mới"
        bordered={false}
        className="shadow-lg w-full"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOnFinish}
          initialValues={{
            enable: true,
            tags: [],
          }}
        >
          {/* Basic Information */}
          <div className="flex gap-4 items-center w-full flex-wrap">
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              className="w-full lg:flex-1"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập tên sản phẩm"
                className="w-full lg:flex-1 rounded-lg border-[#d9d9d9]"
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá cơ bản"
              className="w-full lg:flex-1"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm" },
              ]}
            >
              <InputNumber
                min={1}
                size="large"
                placeholder="Nhập giá"
                className="w-full"
              />
            </Form.Item>
          </div>

          {/* Categories */}
          <div className="flex gap-4 items-center w-full flex-wrap">
            <Form.Item
              name="type"
              className="w-full lg:flex-1"
              label="Loại danh mục"
              rules={[{ required: true, message: "Vui chọn loại danh mục" }]}
            >
              <Select
                onChange={handleChangeType}
                size="large"
                placeholder="Chọn loại danh mục"
                allowClear
              >
                <Select.Option value={"wear"}>Động vật thủy sinh</Select.Option>
                <Select.Option value={"decorate"}>
                  Thực vật thủy sinh
                </Select.Option>
                <Select.Option value={"extra"}>Phụ kiện thủy sinh</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="parentCategory"
              label="Danh mục (0)"
              className="w-full lg:flex-1"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn danh mục",
                },
              ]}
            >
              <Select
                disabled={!type ? true : false}
                size="large"
                placeholder="Chọn danh mục (0)"
                allowClear
                mode="multiple"
              >
                {parentCategories?.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="childCategory"
              label="Danh mục (1)"
              className="w-full lg:flex-1"
            >
              <Select
                placeholder="Chọn danh mục (1)"
                size="large"
                mode="multiple"
                disabled={!type ? true : false}
                allowClear
              >
                {childCategories?.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="brand"
              label="Thương hiệu"
              className="w-full lg:flex-1"
              rules={[{ required: true, message: "Vui chọn lòng thương hiệu" }]}
            >
              <Select placeholder="Chọn thương hiệu" size="large" allowClear>
                {brands?.map((brand) => (
                  <Select.Option key={brand._id} value={brand._id}>
                    {brand.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Images */}
          <div className="flex gap-4 items-center flex-wrap">
            <Form.Item
              name="mainImage"
              label="Ảnh hiển thị"
              className="w-full lg:flex-1"
              rules={[{ required: true, message: "Vui lòng chọn hiển thị" }]}
            >
              <Upload
                listType="picture-card"
                fileList={mainImageList}
                onChange={handleMainImageChange}
                beforeUpload={() => false}
                maxCount={1}
              >
                {mainImageList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div className="mt-2">Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              name="images"
              label="Danh sách ảnh"
              rules={[
                { required: true, message: "Vui lòng chọn danh sách ảnh" },
              ]}
              className="w-full lg:flex-1"
            >
              <Upload
                listType="picture-card"
                fileList={imagesList}
                onChange={handleImagesChange}
                beforeUpload={() => false}
                multiple
                maxCount={4}
              >
                {imagesList.length < 4 && (
                  <div>
                    <PlusOutlined />
                    <div className="mt-2">Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>

          {/* Tags */}
          <div className="flex gap-4 items-center flex-wrap">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tag sản phẩm",
                },
              ]}
              name="tags"
              label="Tags"
              className="w-full lg:flex-1"
            >
              <Select size="large" placeholder="Chọn tags">
                <Select.Option value="HOT">HOT</Select.Option>
                <Select.Option value="NEW">NEW</Select.Option>
                <Select.Option value="SALE">SALE</Select.Option>
                <Select.Option value="SELLING">SELLING</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="totalQuantity"
              label="Số lượng"
              className="w-full lg:flex-1"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lượng sản phẩm",
                },
              ]}
            >
              <InputNumber
                min={1}
                size="large"
                placeholder="Nhập số lượng"
                className="w-full"
              />
            </Form.Item>
          </div>

          {/* Description */}
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
          />
          <Form.Item className="hidden" name="description">
            <Input />
          </Form.Item>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full px-4 py-3 rounded-full uppercase mt-4"
            type="submit"
            size="large"
          >
            {loading ? (
              <>
                <Spin /> Đang xử lý...
              </>
            ) : (
              "Thêm sản phẩm"
            )}
          </button>
        </Form>
      </Card>
    </div>
  );
};

export default CreateProduct;
