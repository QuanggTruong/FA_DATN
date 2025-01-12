import React, { useEffect, useState } from "react";
import {
  Card,
  Radio,
  Select,
  Tag,
  Empty,
  Breadcrumb,
  Checkbox,
  Button,
  Tooltip,
  Drawer,
} from "antd";
import {
  RiFilterLine,
  RiPriceTag3Line,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiFilterOffLine,
} from "react-icons/ri";
import ProductList from "../../components/ProductList";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductByCategory } from "../../redux/product/product.thunk";

const FilterSection = ({ title, children }) => (
  <div className="p-4 border-b border-neutral-200 last:border-b-0">
    <h3 className="text-neutral-800 font-medium mb-4 flex items-center gap-2">
      {title}
    </h3>
    {children}
  </div>
);

const Category = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const [products, setProducts] = useState([]);
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [filters, setFilters] = useState({
    priceRange: null,
    availableTags: [],
    sortOptions: [
      { label: "Mới nhất", value: "newest" },
      { label: "Cũ nhất", value: "oldest" },
      { label: "Giá tăng dần", value: "price_asc" },
      { label: "Giá giảm dần", value: "price_desc" },
    ],
  });
  const [isLoading, setIsloading] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    tags: [],
    sort: "newest",
    categories: [],
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalItems: 0,
    totalPage: 0,
  });

  const fetchProducts = async () => {
    try {
      setIsloading(true);
      const payload = {
        slug,
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...selectedFilters,
      };

      const result = await dispatch(getProductByCategory(payload)).unwrap();

      if (result.success) {
        setCategoryName(result.name);
        setProducts(result.data);
        setPagination((prev) => ({
          ...prev,
          ...result.pagination,
        }));
        setFilters((prev) => ({
          ...prev,
          ...result.filters,
        }));

        const selectedCategory = categories.find((cat) =>
          cat.children?.some((child) => child.slug === slug)
        );
        if (selectedCategory) {
          setExpandedCategories((prev) => ({
            ...prev,
            [selectedCategory._id]: true,
          }));
        }
      }
    } catch (error) {
      setIsloading(false);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [slug, pagination.page, pagination.pageSize, selectedFilters]);

  const handleFilterChange = (type, value) => {
    setPagination((prev) => ({ ...prev, page: 1 }));

    if (type === "categories") {
      setSelectedFilters((prev) => ({
        ...prev,
        [type]: value,
      }));

      if (value.length > prev.categories.length) {
        const newCategoryId = value.find((id) => !prev.categories.includes(id));
        const parentCategory = categories.find((cat) =>
          cat.children?.some((child) => child._id === newCategoryId)
        );
        if (parentCategory) {
          setExpandedCategories((prev) => ({
            ...prev,
            [parentCategory._id]: true,
          }));
        }
      }
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const resetFilters = () => {
    setSelectedFilters({
      price: [],
      tags: [],
      sort: "newest",
      categories: [],
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setExpandedCategories({});
    navigate(`/category/${slug}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const FiltersContent = () => (
    <div className="space-y-2">
      <FilterSection
        title={
          <div className="flex items-center uppercase text-lg">
            Danh mục sản phẩm
          </div>
        }
      >
        {categories.map((parentCat) => (
          <div key={parentCat._id} className="mb-2">
            <div
              className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-md cursor-pointer"
              onClick={() => toggleCategory(parentCat._id)}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedFilters.categories.includes(parentCat._id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange(
                      "categories",
                      e.target.checked
                        ? [...selectedFilters.categories, parentCat._id]
                        : selectedFilters.categories.filter(
                            (id) => id !== parentCat._id
                          )
                    );
                  }}
                />
                <span className="text-neutral-700">{parentCat.name}</span>
              </div>
              {parentCat.children?.length > 0 &&
                (expandedCategories[parentCat._id] ? (
                  <RiArrowUpSLine className="text-lg" />
                ) : (
                  <RiArrowDownSLine className="text-lg" />
                ))}
            </div>

            {parentCat.children && expandedCategories[parentCat._id] && (
              <div className="ml-6 space-y-1 mt-1">
                {parentCat.children.map((childCat) => (
                  <div
                    key={childCat._id}
                    className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-md"
                  >
                    <Checkbox
                      checked={selectedFilters.categories.includes(
                        childCat._id
                      )}
                      onChange={(e) => {
                        handleFilterChange(
                          "categories",
                          e.target.checked
                            ? [...selectedFilters.categories, childCat._id]
                            : selectedFilters.categories.filter(
                                (id) => id !== childCat._id
                              )
                        );
                        if (e.target.checked) {
                          navigate(`/category/${childCat.slug}`);
                        }
                      }}
                    >
                      <span className="text-neutral-600">{childCat.name}</span>
                    </Checkbox>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </FilterSection>

      {filters?.priceRange && (
        <FilterSection
          title={
            <div className="flex items-center">
              <RiPriceTag3Line className="text-lg mr-2" />
              Khoảng giá
            </div>
          }
        >
          <Radio.Group
            className="w-full space-y-2"
            value={selectedFilters.price.join(",")}
            onChange={(e) => {
              handleFilterChange(
                "price",
                e.target.value.split(",").map(Number)
              );
            }}
          >
            {filters.priceRange.ranges.map((range, index) => (
              <Radio
                key={index}
                value={range.value.join(",")}
                className="block w-full p-2 hover:bg-neutral-50 rounded-md"
              >
                {range.label}
              </Radio>
            ))}
          </Radio.Group>
        </FilterSection>
      )}

      {filters?.availableTags?.length > 0 && (
        <FilterSection
          title={
            <div className="flex items-center">
              <RiFilterLine className="text-lg mr-2" />
              Tags
            </div>
          }
        >
          <div className="flex flex-wrap gap-2">
            {filters.availableTags.map((tag) => (
              <Tag.CheckableTag
                key={tag}
                checked={selectedFilters.tags.includes(tag)}
                onChange={(checked) => {
                  handleFilterChange(
                    "tags",
                    checked
                      ? [...selectedFilters.tags, tag]
                      : selectedFilters.tags.filter((t) => t !== tag)
                  );
                }}
                className={`
                  text-sm py-1.5 px-3 border rounded-full transition-all
                  ${
                    selectedFilters.tags.includes(tag)
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "text-neutral-600 border-neutral-300 hover:border-neutral-900"
                  }
                `}
              >
                {tag}
              </Tag.CheckableTag>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );

  return (
    <div className="py-4">
      <Breadcrumb
        className="py-4"
        items={[
          { title: "Trang chủ" },
          { title: "Danh mục sản phẩm" },
          { title: categoryName },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Filters */}
        <div className="hidden lg:block w-72">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
            <FiltersContent />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <Button
            icon={<RiFilterLine />}
            onClick={() => setIsMobileFilterVisible(true)}
            className="w-full bg-white"
          >
            Bộ lọc
          </Button>
        </div>

        {/* Mobile Filter Drawer */}
        <Drawer
          title="Bộ lọc"
          placement="left"
          onClose={() => setIsMobileFilterVisible(false)}
          open={isMobileFilterVisible}
          width={320}
        >
          <FiltersContent />
        </Drawer>

        {/* Product List Section */}
        <div className="flex-1">
          <Card className="shadow-sm">
            <div className="flex items-center justify-between flex-wrap w-full space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium uppercase text-lg">
                  Danh sách sản phẩm
                </span>
                {pagination.totalItems > 0 && (
                  <span className="text-neutral-500 text-sm">
                    ({pagination.totalItems} sản phẩm)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {(selectedFilters.price.length > 0 ||
                  selectedFilters.tags.length > 0 ||
                  selectedFilters.categories.length > 0 ||
                  selectedFilters.sort !== "newest") && (
                  <Tooltip title="Xóa bộ lọc">
                    <Button
                      icon={<RiFilterOffLine />}
                      onClick={resetFilters}
                      className="flex items-center"
                    >
                      Làm mới
                    </Button>
                  </Tooltip>
                )}
                <Select
                  value={selectedFilters.sort}
                  onChange={(value) => handleFilterChange("sort", value)}
                  options={filters.sortOptions}
                  className="w-40"
                  suffixIcon={<RiArrowDownSLine />}
                />
              </div>
            </div>
            <div className="py-4 flex gap-2 flex-wrap">
              <img
                className="rounded-lg lg:flex-1 lg:w-32 w-full"
                src="https://bizweb.dktcdn.net/100/403/653/themes/787129/assets/slider_2.jpg?1724563342300"
                alt=""
              />
              <img
                className="rounded-lg lg:flex-1 lg:w-32 w-full"
                src="https://bizweb.dktcdn.net/100/403/653/themes/787129/assets/slider_3.jpg?1724563342300"
                alt=""
              />
            </div>
            <>
              {products?.length > 0 ? (
                <ProductList
                  products={products}
                  setPagination={setPagination}
                  pagination={pagination}
                  isLoading={isLoading}
                />
              ) : (
                <Empty description="Không tìm thấy sản phẩm phù hợp" />
              )}
            </>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Category;
