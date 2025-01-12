import React, { useEffect, useState } from "react";
import {
  Modal,
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
import { deleteFile, uploadFile } from "../../helpers/uploadCloudinary";
import { getCategoryAdmin } from "../../redux/category/category.thunk";
import {
  getProductAdmin,
  updateProduct,
} from "../../redux/product/product.thunk";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import TurndownService from "turndown";
import { getBrandByCreatePro } from "../../redux/brand/brand.thunk";

const ModalUpdateProduct = ({
  open = false,
  setOpen,
  width = 1400,
  data = {},
  setData,
}) => {
  const mdParser = new MarkdownIt();
  const turndownService = new TurndownService();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { categoriesAll: categories } = useSelector((state) => state.category);
  const { brands } = useSelector((state) => state.brand);
  const { pagination } = useSelector((state) => state.product);
  const [loading, setLoading] = useState(false);
  const [mainImageList, setMainImageList] = useState([]);
  const [imagesList, setImagesList] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(getCategoryAdmin());
    dispatch(getBrandByCreatePro());
  }, [dispatch]);

  useEffect(() => {
    if (data && open) {
      const markdownDescription = turndownService.turndown(data.description);
      setDescription(markdownDescription);
      setType(data.categories[0].type);

      if (data.mainImage?.url) {
        setMainImageList([
          {
            uid: "-1",
            name: "mainImage",
            status: "done",
            url: data.mainImage.url,
            publicId: data.mainImage.publicId,
          },
        ]);
      }

      if (data.images?.length) {
        setImagesList(
          data.images.map((image, index) => ({
            uid: `-${index + 1}`,
            name: `image-${index}`,
            status: "done",
            url: image.url,
            publicId: image.publicId,
          }))
        );
      }

      // Set categories based on type
      if (data.categories[0].type) {
        const parentCats = categories.filter(
          (item) => item.type === data.categories[0].type && item.level === 0
        );
        const childCats = parentCats
          .flatMap((item) => item.children || [])
          .filter(
            (child) =>
              child.type === data.categories[0].type && child.level === 1
          );
        setParentCategories(parentCats);
        setChildCategories(childCats);
      }

      // Set form values
      form.setFieldsValue({
        name: data.name,
        price: data.price,
        type: data.categories[0].type,
        mainImage: data.mainImage,
        images: data.images,
        parentCategory: data.categories
          .filter((cat) => cat.level === 0)
          .map((cat) => cat._id),
        childCategory: data.categories
          .filter((cat) => cat.level === 1)
          .map((cat) => cat._id),
        brand: data.brand,
        totalQuantity: data.totalQuantity,
        description: data.description,
        tags: data.tags,
      });
    }
  }, [data, open, form, categories]);

  const handleChangeType = (value) => {
    setType(value);
    if (value) {
      const parentCats = categories.filter(
        (item) => item.type === value && item.level === 0
      );
      const childCats = parentCats
        .flatMap((item) => item.children || [])
        .filter((child) => child.type === value && child.level === 1);
      setParentCategories(parentCats);
      setChildCategories(childCats);

      // Reset category selections when type changes
      form.setFieldsValue({
        parentCategory: [],
        childCategory: [],
      });
    } else {
      setParentCategories([]);
      setChildCategories([]);
    }
  };

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
    } else if (mainImageList[0]?.url) {
      mainImageData = {
        url: mainImageList[0].url,
        publicId: mainImageList[0].publicId,
      };
    }

    const imagesData = await Promise.all(
      imagesList.map(async (file) => {
        if (file.originFileObj) {
          const result = await uploadFile(file.originFileObj);
          return {
            url: result.secure_url,
            publicId: result.public_id,
          };
        }
        return {
          url: file.url,
          publicId: file.publicId,
        };
      })
    );

    return {
      mainImage: mainImageData,
      images: imagesData,
    };
  };

  const handleCancel = () => {
    setOpen(false);
    setData(null);
    form.resetFields();
    setMainImageList([]);
    setImagesList([]);
    setType("");
    setParentCategories([]);
    setChildCategories([]);
  };

  const handleOnFinish = async (values) => {
    try {
      setLoading(true);
      const uploadedImages = await uploadAllImages();

      const parentCategory = values.parentCategory || [];
      const childCategory = values.childCategory || [];

      const finalPayload = {
        ...data,
        ...values,
        categories: [...parentCategory, ...childCategory],
        mainImage: uploadedImages.mainImage,
        images: uploadedImages.images,
      };

      delete finalPayload.parentCategory;
      delete finalPayload.childCategory;

      const res = await dispatch(updateProduct(finalPayload)).unwrap();
      if (res.success) {
        const deletePromises = [];

        if (
          uploadedImages.mainImage?.publicId &&
          data.mainImage?.publicId &&
          uploadedImages.mainImage.publicId !== data.mainImage.publicId
        ) {
          deletePromises.push(deleteFile(data.mainImage.publicId));
        }

        if (uploadedImages.images?.length > 0 && data.images?.length > 0) {
          const newPublicIds = uploadedImages.images.map((img) => img.publicId);
          const oldPublicIds = data.images.map((img) => img.publicId);

          const deletedImages = oldPublicIds.filter(
            (oldId) => !newPublicIds.includes(oldId)
          );

          deletedImages.forEach((publicId) => {
            if (publicId) {
              deletePromises.push(deleteFile(publicId));
            }
          });
        }

        if (deletePromises.length > 0) {
          await Promise.all(deletePromises);
        }

        message.success(res.message);
        dispatch(
          getProductAdmin({
            ...pagination,
            search: "",
          })
        );
        handleCancel();
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = ({ html, text }) => {
    form.setFieldsValue({ description: html });
    setDescription(text);
  };

  return (
    <Modal
      title="Cập nhật sản phẩm"
      open={open}
      onCancel={handleCancel}
      width={width}
      footer={null}
    >
      <div className="mx-auto">
        <Card bordered={false} className="shadow-lg w-full">
          <Form form={form} layout="vertical" onFinish={handleOnFinish}>
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
                  disabled={!type}
                  size="large"
                  placeholder="Chọn danh mục (0)"
                  mode="multiple"
                  allowClear
                >
                  {parentCategories.map((category) => (
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
                  size="large"
                  placeholder="Chọn danh mục (1)"
                  mode="multiple"
                  disabled={!type}
                  allowClear
                >
                  {childCategories.map((category) => (
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
                rules={[
                  { required: true, message: "Vui chọn lòng thương hiệu" },
                ]}
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
                <Select size="large" placeholder="Chọn tags" mode="multiple">
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
              value={description}
            />
            <Form.Item className="hidden" name="description">
              <Input />
            </Form.Item>

            {/* Submit Button */}
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
                "Cập nhật sản phẩm"
              )}
            </button>
          </Form>
        </Card>
      </div>
    </Modal>
  );
};

export default ModalUpdateProduct;
