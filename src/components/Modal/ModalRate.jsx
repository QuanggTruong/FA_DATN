import React, { useEffect, useState } from "react";
import { Modal, Rate, Upload, message, notification } from "antd";
import {
  UploadOutlined,
  LoadingOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { uploadFile, deleteFile } from "../../helpers/uploadCloudinary";
import { validateForm, validateReviewSchema } from "../../validate/validate";
import ErrorValidate from "../Notification/ErrorValidate";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  getReviewProduct,
} from "../../redux/review/review.thunk";
import { useNavigate } from "react-router-dom";
import { getOrderHistory } from "../../redux/order/order.thunk";
import { createIcon } from "../../ultis/createIcon";

const ModalRate = ({
  product = {},
  order = "",
  open,
  setOpen,
  rate,
  setRate,
  setHoverValue,
  hoverValue,
}) => {
  const [review, setReview] = useState({
    order: "",
    product: "",
    rate: 0,
    images: [],
    comment: "",
  });
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [validates, setValidates] = useState({});
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    setReview((prev) => ({
      ...prev,
      product: product?._id,
      rate: rate,
      order: order,
    }));
  }, [rate]);

  const handleImageUpload = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    setUploading(true);
    try {
      onProgress({ percent: 0 });
      const result = await uploadFile(file);
      onProgress({ percent: 100 });
      onSuccess(result);
      setReview((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          { url: result.secure_url, publicId: result.public_id },
        ],
      }));
      setFileList((prevFileList) => [
        ...prevFileList,
        {
          uid: result.public_id,
          name: file.name,
          status: "done",
          url: result.secure_url,
        },
      ]);
    } catch (error) {
      onError({ error });
      message.error(`${file.name} tải lên thất bại.`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (file) => {
    const index = review.images.findIndex((img) => img.url === file.url);
    if (index > -1) {
      setUploading(true);
      try {
        await deleteFile(review.images[index].publicId);
        setReview((prev) => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
        }));
        setFileList((prevFileList) =>
          prevFileList.filter((item) => item.uid !== file.uid)
        );
      } catch (error) {
        message.error("Có lỗi xảy ra khi xóa ảnh. Vui lòng thử lại.");
      } finally {
        setUploading(false);
      }
    }
  };

  const openNotification = () => {
    notification.success({
      message: (
        <span className="text-lg font-semibold">
          Đánh giá sản phẩm thành công
        </span>
      ),
      description: (
        <div>
          <p className="text-base font-medium">
            Cảm ơn bạn đã dành thời gian chia sẻ trải nghiệm!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Đánh giá của bạn sẽ giúp ích cho cộng đồng người mua hàng.
          </p>
        </div>
      ),
      placement: "top",
      duration: 5,
      icon: <HeartFilled style={{ color: "#e28585" }} />,
      style: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        width: "600px",
        borderRadius: 10,
      },
      className: "bg-gradient-to-br from-amber-50 to-orange-50",
    });
  };

  const handleRate = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const validationErrors = await validateForm({
      input: review,
      validateSchema: validateReviewSchema,
    });

    if (Object.keys(validationErrors).length > 0) {
      setValidates(validationErrors);
      if (validates.rate && !validates.comment) {
        message.warning(validates.rate);
      }
      return;
    }

    dispatch(createReview(review)).then((res) => {
      if (res.payload.success) {
        setReview((prev) => ({
          ...prev,
          rate: 0,
          images: [],
          comment: "",
        }));
        setFileList([]);
        setRate(0);
        setHoverValue(0);
        openNotification();
        if (product?.slug) {
          dispatch(
            getReviewProduct({
              productId: product?._id,
              page: 1,
              pageSize: 9,
              rate: "",
              hasImage: "",
              hasComment: "",
            })
          );
        } else {
          dispatch(
            getOrderHistory({
              status: "delivered",
              page: 1,
              pageSize: 10,
            })
          );
        }
        setOpen(false);
      }
    });
  };

  const handleCancelRate = async () => {
    setReview({
      order: "",
      product: "",
      rate: 0,
      images: [],
      comment: "",
    });
    setFileList([]);
    setRate(0);
    setHoverValue(0);
    setValidates({});

    if (review.images.length > 0) {
      setUploading(true);
      try {
        const deletePromises = review.images.map((img) =>
          deleteFile(img.publicId)
        );
        await Promise.all(deletePromises);
      } catch (error) {
        message.error("Có lỗi xảy ra khi xóa ảnh. Vui lòng thử lại.");
      } finally {
        setUploading(false);
      }
    }
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      title={
        <div className="text-lg md:text-2xl font-bold text-center">
          Đánh giá sản phẩm
        </div>
      }
      onOk={handleRate}
      onCancel={handleCancelRate}
      footer={[
        <button
          disabled={uploading}
          key="cancel"
          onClick={handleCancelRate}
          className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 border px-6 py-2 rounded-full transition duration-300 ease-in-out"
        >
          Hủy
        </button>,
        <button
          key="rate"
          onClick={handleRate}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2"
          disabled={uploading}
        >
          Gửi đánh giá
        </button>,
      ]}
      width={600}
    >
      <div className="flex items-center space-x-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <img
          className="rounded-lg w-20 h-20 md:w-24 md:h-24 object-cover"
          src={product?.image || product?.mainImage?.url}
          alt="product"
        />
        <div className="text-sm font-medium md:text-base">{product?.name}</div>
      </div>

      <div className="flex justify-center mb-6">
        <Rate
          value={rate}
          character={({ index }) =>
            createIcon({
              index: index + 1,
              rate: rate,
              hoverValue: hoverValue,
              width: "34px",
              height: "34px",
              activeColor: "#feb705",
            })
          }
          onChange={(value) => {
            setRate(value);
            setReview((prev) => ({ ...prev, rate: value }));
          }}
          onHoverChange={(value) => {
            setHoverValue(value || 0);
          }}
        />
      </div>

      <div className="mb-4">
        <Upload
          accept="image/*"
          listType="picture-card"
          customRequest={handleImageUpload}
          onRemove={handleImageDelete}
          fileList={fileList}
          beforeUpload={(file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
              message.error("Chỉ được phép tải lên file ảnh!");
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
            }
            return isImage && isLt2M;
          }}
          maxCount={4}
        >
          {fileList.length >= 4 ? null : (
            <div>
              {uploading ? <LoadingOutlined /> : <UploadOutlined />}
              <div style={{ marginTop: 8 }}>
                {uploading ? "Đang tải..." : "Tải ảnh lên"}
              </div>
            </div>
          )}
        </Upload>
      </div>

      <div className="mb-2">
        <div className="font-medium mb-2 text-base">Nội dung đánh giá:</div>
        <textarea
          className={`w-full p-3  ${
            validates.comment ? "border-red-500" : "border border-gray-300"
          } rounded-lg border bg-transparent text-gray-700border-gray-300 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-colors ease-in-out`}
          rows="4"
          placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
          value={review.comment}
          onChange={(e) =>
            setReview((prev) => ({ ...prev, comment: e.target.value }))
          }
        ></textarea>
        {validates.comment ? <ErrorValidate message={validates.comment} /> : ""}
      </div>
    </Modal>
  );
};

export default ModalRate;
