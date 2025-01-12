import {
  Progress,
  Avatar,
  List,
  Rate,
  Space,
  Button,
  Select,
  Card,
  Spin,
  Pagination,
  Image,
} from "antd";
import { createAverageRate, createIcon, SingleStar } from "../ultis/createIcon";
import {
  CameraOutlined,
  CommentOutlined,
  HighlightOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useCallback, useState, useEffect } from "react";
import ModalRate from "./Modal/ModalRate";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { getReviewProduct } from "../redux/review/review.thunk";
import { formatDateReview } from "../helpers/formatDate";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import { MdVerified, MdDateRange } from "react-icons/md";

const RateList = ({ product }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const { reviews, pagination, isLoading, averageRating, rateDistribution } =
    useSelector((state) => state.review);
  const [reviewFilter, setReviewFilter] = useState({
    rate: "",
    hasImage: "",
    hasComment: "",
  });
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 5,
    totalPage: 0,
    totalItems: 0,
  });

  const fetchReviews = useCallback(() => {
    if (!isEmpty(product)) {
      dispatch(
        getReviewProduct({
          productId: product?._id,
          page: paginate.page,
          pageSize: paginate.pageSize,
          ...reviewFilter,
        })
      );
    }
  }, [product?._id, paginate.page, paginate.pageSize, reviewFilter, dispatch]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination?.page,
        pageSize: pagination?.pageSize,
        totalPage: pagination?.totalPage,
        totalItems: pagination?.totalItems,
      }));
    }
  }, [pagination]);

  const handleFilterChange = (type, value) => {
    setReviewFilter((prev) => ({
      ...prev,
      [type]: value,
    }));
    setPaginate((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const ratings = Object.entries(rateDistribution).map(([score, count]) => ({
    score,
    count,
  }));
  const totalRatings = Object.values(rateDistribution).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <>
      <ModalRate
        {...{
          open,
          setOpen,
          rate,
          setRate,
          setHoverValue,
          hoverValue,
          product,
        }}
      />

      <h2 className="text-2xl font-bold mb-6 uppercase">Đánh giá sản phẩm</h2>
      <Space wrap className="w-full justify-center mb-4">
        <Button
          type={reviewFilter.rate === "" ? "primary" : "default"}
          onClick={() => {
            handleFilterChange("rate", "");
            handleFilterChange("hasImage", "");
            handleFilterChange("hasComment", "");
          }}
          className={reviewFilter.rate === "" ? "bg-yellow-400" : ""}
        >
          Tất cả
        </Button>
        <Select
          placeholder="Lọc theo sao"
          allowClear
          onChange={(value) => handleFilterChange("rate", value)}
          className="min-w-[120px]"
          options={[5, 4, 3, 2, 1].map((score) => ({
            value: score,
            label: (
              <span className="flex items-center gap-1">
                {score} <SingleStar />
              </span>
            ),
          }))}
        />
        <Button
          type={reviewFilter.hasImage === "true" ? "primary" : "default"}
          onClick={() => {
            handleFilterChange(
              "hasImage",
              reviewFilter.hasImage === "true" ? "" : "true"
            );
          }}
          className={reviewFilter.hasImage === "true" ? "bg-yellow-400" : ""}
        >
          <CameraOutlined /> Có hình
        </Button>
        <Button
          type={reviewFilter.hasComment === "true" ? "primary" : "default"}
          onClick={() =>
            handleFilterChange(
              "hasComment",
              reviewFilter.hasComment === "true" ? "" : "true"
            )
          }
          className={reviewFilter.hasComment === "true" ? "bg-yellow-400" : ""}
        >
          <CommentOutlined /> Có bình luận
        </Button>
        <Button
          onClick={() => setOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
        >
          <HighlightOutlined /> Viết đánh giá
        </Button>
      </Space>
      {/* Rating Overview */}
      <Card className="bg-gray-50 mb-4">
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2 text-gray-800">
              {parseFloat(averageRating || 0).toFixed(1)}
            </div>
            <Rate
              disabled
              character={({ index }) =>
                createAverageRate({
                  index: index + 1,
                  rate: parseFloat(averageRating || 0),
                  width: "24px",
                  height: "24px",
                  activeColor: "#facc15",
                })
              }
            />
            <div className="mt-2 text-gray-600">{reviews.length} đánh giá</div>
          </div>
        </div>

        <div className="space-y-2">
          {ratings.map(({ score, count }) => (
            <div key={score} className="flex items-center gap-3">
              <span className="w-12 text-gray-700 flex items-center gap-1">
                {score} <SingleStar />
              </span>
              <Progress
                percent={Math.round((count / totalRatings) * 100)}
                strokeColor="#facc15"
                showInfo={false}
              />
              <span className="w-12 text-right text-gray-600">({count})</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Reviews List */}
      <Spin spinning={isLoading}>
        {reviews.length === 0 ? (
          <Card className="text-center bg-gray-50">
            <div className="py-8 text-gray-500 italic">
              Chưa có đánh giá nào cho sản phẩm này
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <List
              itemLayout="vertical"
              dataSource={reviews}
              renderItem={(review) => (
                <Card className="bg-gray-50">
                  {/* User Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar
                      src={review.user.avatar.url}
                      className="border-2 border-yellow-200"
                      size={48}
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-semibold text-gray-800">
                          {review.user.name}
                        </span>
                        {review.order && (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <MdVerified />
                            Đã mua hàng
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                          <MdDateRange />
                          {formatDateReview(review.createdAt)}
                        </span>
                      </div>
                      <Rate
                        disabled
                        value={review.rate}
                        character={({ index }) =>
                          createIcon({
                            index: index + 1,
                            rate: review.rate,
                            hoverValue: review.rate,
                            width: "16px",
                            height: "16px",
                            activeColor: "#facc15",
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="rounded-lg mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaQuoteLeft className="text-yellow-400" />
                      <p>{review.comment}</p>
                      <FaQuoteRight className="text-yellow-400" />
                    </div>
                  </div>

                  {/* Review Images */}
                  {review.images?.length > 0 && (
                    <Image.PreviewGroup>
                      <div className="flex flex-wrap gap-2">
                        {review.images.map((image, index) => (
                          <Image
                            key={index}
                            src={image.url}
                            alt={`Review ${index + 1}`}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                            preview={{
                              maskClassName: "rounded-lg",
                              mask: (
                                <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50 rounded-lg">
                                  <EyeOutlined className="text-white text-2xl" />
                                </div>
                              ),
                            }}
                          />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  )}
                </Card>
              )}
            />

            {/* Pagination */}
            <div className="flex justify-end mt-6">
              <Pagination
                current={paginate.page}
                pageSize={paginate.pageSize}
                total={paginate.totalItems}
                onChange={(page) => setPaginate((prev) => ({ ...prev, page }))}
                onShowSizeChange={(_, pageSize) =>
                  setPaginate((prev) => ({ ...prev, pageSize }))
                }
                showTotal={(total) => `Tổng ${total} đánh giá`}
              />
            </div>
          </div>
        )}
      </Spin>
    </>
  );
};

export default RateList;
