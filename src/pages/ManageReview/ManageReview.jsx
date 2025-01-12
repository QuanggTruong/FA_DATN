import React, { useCallback, useEffect, useState } from "react";
import TableReview from "../../components/Table/TableReview";
import { Input, Select, DatePicker, Card } from "antd";
import { HeartOutlined, SearchOutlined, StarOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { getReviewlist } from "../../redux/review/review.thunk";
import moment from "moment";
import "moment/locale/vi";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ManageReview = () => {
  const dispatch = useDispatch();
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    rate: "",
    customerName: "",
    productName: "",
    fromDate: "",
    toDate: "",
  });

  const { reviews, pagination, isLoading } = useSelector(
    (state) => state.review
  );

  useEffect(() => {
    dispatch(getReviewlist({ ...paginate, ...filters }));
  }, [dispatch, paginate.page, paginate.pageSize, filters]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPage: pagination.totalPage,
        totalItems: pagination.totalItems,
      }));
    }
  }, [pagination]);

  const debouncedFilter = useCallback(
    debounce((name, value) => {
      setFilters((prev) => ({ ...prev, [name]: value }));
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );

  const handleFilterChange = (name, value) => {
    debouncedFilter(name, value);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setFilters((prev) => ({
        ...prev,
        fromDate: dates[0].toISOString(),
        toDate: dates[1].toISOString(),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        fromDate: "",
        toDate: "",
      }));
    }
    setPaginate((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="py-8">
      <Card className="mb-4 bg-white rounded-md shadow-lg">
        <div className="flex flex-wrap gap-4">
          <Input
            className="w-full sm:w-auto flex-1"
            placeholder="Tên khách hàng"
            onChange={(e) => handleFilterChange("customerName", e.target.value)}
            suffix={<SearchOutlined />}
          />
          <Input
            className="w-full sm:w-auto flex-1"
            placeholder="Tên sản phẩm"
            onChange={(e) => handleFilterChange("productName", e.target.value)}
            suffix={<SearchOutlined />}
          />
          <Select
            className="w-full sm:w-auto flex-1"
            placeholder="Đánh giá"
            onChange={(value) => handleFilterChange("rate", value)}
            allowClear
          >
            <Option value="">Tất cả</Option>
            <Option value="1">
              1 <StarOutlined />
            </Option>
            <Option value="2">
              2 <StarOutlined />
            </Option>
            <Option value="3">
              3 <StarOutlined />
            </Option>
            <Option value="4">
              4 <StarOutlined />
            </Option>
            <Option value="5">
              5 <StarOutlined />
            </Option>
          </Select>
          <RangePicker
            className="w-full sm:w-auto"
            placeholder={["Từ ngày", "Đến ngày"]}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            locale={moment.locale("vi")}
          />
        </div>
      </Card>
      <TableReview
        filters={filters}
        reviews={reviews}
        isLoading={isLoading}
        page={paginate.page}
        pageSize={paginate.pageSize}
        totalItems={paginate.totalItems}
        setPaginate={setPaginate}
      />
    </div>
  );
};

export default ManageReview;
