import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductByBrand } from "../../redux/product/product.thunk";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Drawer,
  Empty,
  Radio,
  Select,
  Tag,
  Tooltip,
} from "antd";
import {
  RiArrowDownSLine,
  RiFilterLine,
  RiFilterOffLine,
  RiPriceTag3Line,
} from "react-icons/ri";
import ProductList from "../../components/ProductList";

const Brand = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.brand);
  const [products, setProducts] = useState([]);
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const [expandedBrands, setExpandedBrands] = useState({});
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
  const [brandName, setBrandName] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    tags: [],
    sort: "newest",
    brands: [],
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

      const result = await dispatch(getProductByBrand(payload)).unwrap();

      if (result.success) {
        setBrandName(result.name);
        setProducts(result.data);
        setPagination((prev) => ({
          ...prev,
          ...result.pagination,
        }));
        setFilters((prev) => ({
          ...prev,
          ...result.filters,
        }));

        const selectedBrand = brands.find((brand) =>
          brand.children?.some((child) => child.slug === slug)
        );
        if (selectedBrand) {
          setExpandedBrands((prev) => ({
            ...prev,
            [selectedBrand._id]: true,
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

    if (type === "brands") {
      setSelectedFilters((prev) => ({
        ...prev,
        [type]: value,
      }));
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
      brands: [],
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setExpandedBrands({});
    navigate(`/brands/${slug}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleCategory = (brandId) => {
    setExpandedBrands((prev) => ({
      ...prev,
      [brandId]: !prev[brandId],
    }));
  };

  const FilterSection = ({ title, children }) => (
    <div className="p-4 border-b border-neutral-200 last:border-none">
      {title && <div className="mb-4">{title}</div>}
      {children}
    </div>
  );

  const FiltersContent = () => (
    <div className="space-y-2">
      <FilterSection
        title={
          <div className="flex items-center gap-2 uppercase text-lg font-bold">
            Thương hiệu
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-2">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className={`
                relative transition-all duration-200 
                ${
                  selectedFilters.brands.includes(brand._id)
                    ? "bg-neutral-100"
                    : "hover:bg-neutral-50"
                }
                rounded-lg
              `}
            >
              <label className="flex items-center p-2 cursor-pointer w-full">
                <Checkbox
                  checked={selectedFilters.brands.includes(brand._id)}
                  onChange={(e) => {
                    handleFilterChange(
                      "brands",
                      e.target.checked
                        ? [...selectedFilters.brands, brand._id]
                        : selectedFilters.brands.filter(
                            (id) => id !== brand._id
                          )
                    );
                    if (e.target.checked) {
                      navigate(`/brands/${brand.slug}`);
                    }
                  }}
                  className="hidden"
                />
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-lg border border-neutral-200 overflow-hidden flex-shrink-0">
                    <img
                      src={brand.image.url}
                      alt={brand.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-neutral-700 font-medium block">
                      {brand.name}
                    </span>
                    <span className="text-neutral-500 text-sm">
                      {brand.productCount || 0} sản phẩm
                    </span>
                  </div>
                  {selectedFilters.brands.includes(brand._id) && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full absolute top-2 right-2" />
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {filters?.priceRange && (
        <FilterSection
          title={
            <div className="flex items-center gap-2">
              <RiPriceTag3Line className="text-lg" />
              <span className="uppercase">Khoảng giá</span>
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
            <div className="flex items-center gap-2">
              <RiFilterLine className="text-lg" />
              <span className="uppercase">Tags</span>
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
                      ? "bg-yellow-500 text-white border-yellow-500"
                      : "text-neutral-600 border-neutral-300 hover:border-yellow-500"
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
          { title: "Thương hiệu" },
          { title: brandName }, // Thay categoryName bằng brandName
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
                  Sản phẩm {brandName} {/* Thêm tên thương hiệu */}
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
                  selectedFilters.brands.length > 0 || // Thay categories bằng brands
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

            <div className="py-4">
              <img
                className="rounded-lg"
                src="https://bizweb.dktcdn.net/100/403/653/themes/787129/assets/bb_collection.jpg?1724563342300"
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

export default Brand;
