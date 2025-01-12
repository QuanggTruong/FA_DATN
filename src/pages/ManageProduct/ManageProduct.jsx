import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TableProduct from "../../components/Table/TableProduct";
import { getProductAdmin } from "../../redux/product/product.thunk";
import { debounce } from "lodash";
import { getCategoryAdmin } from "../../redux/category/category.thunk";
import { tags } from "../../const/tags";
import { Button, Card, Input, Select, Tooltip } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const ManageProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, products, pagination } = useSelector(
    (state) => state.product
  );
  const { categoriesAll: categories } = useSelector((state) => state.category);

  const [paginate, setPaginate] = useState({
    page: 1,
    totalPage: 0,
    pageSize: 10,
    totalItems: 0,
  });

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    tag: "",
    sort: "asc",
  });

  const fetchProducts = () => {
    dispatch(getProductAdmin({ ...paginate, ...filters }));
  };

  useEffect(() => {
    fetchProducts();
  }, [paginate.page, paginate.pageSize, filters]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination.page,
        totalPage: pagination.totalPage,
        totalItems: pagination.totalItems,
      }));
    }
  }, [pagination]);

  useEffect(() => {
    dispatch(getCategoryAdmin());
  }, [dispatch]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, name: value }));
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );

  const handleFilterChange = (value, type) => {
    if (type === "name") {
      debouncedSearch(value);
    } else {
      setFilters((prev) => ({ ...prev, [type]: value }));
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }
  };

  return (
    <div className="py-8 mx-auto">
      <Card className="mb-4 bg-white rounded-md shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => handleFilterChange(e.target.value, "name")}
            allowClear
          />
          <Select
            placeholder="Danh mục"
            onChange={(value) => handleFilterChange(value, "category")}
            allowClear
          >
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Tags"
            onChange={(value) => handleFilterChange(value, "tag")}
            allowClear
          >
            {tags.map((item) => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Sắp xếp"
            onChange={(value) => handleFilterChange(value, "sort")}
            allowClear
          >
            <Select.Option value="asc">Giá tăng dần</Select.Option>
            <Select.Option value="desc">Giá giảm dần</Select.Option>
          </Select>
          <Tooltip title="Thêm sản phẩm mới">
            <Button
              size="middle"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/products/create")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Thêm sản phẩm
            </Button>
          </Tooltip>
        </div>
      </Card>
      <TableProduct
        filters={filters}
        productList={products}
        paginate={paginate}
        loading={isLoading}
        setPaginate={setPaginate}
      />
    </div>
  );
};

export default ManageProduct;
