import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Layout,
  Input,
  Menu,
  Badge,
  Popover,
  Avatar,
  Dropdown,
  message,
  Button,
  Drawer,
  Tooltip,
} from "antd";
import { UserOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import { getAllCategory } from "../../redux/category/category.thunk";
import { getProductSearch } from "../../redux/product/product.thunk";
import { logoutCustomer } from "../../redux/auth/auth.slice";
import { formatPrice } from "../../helpers/formatPrice";
import logo from "../../resources/logo2.webp";
import { getSetting } from "../../redux/setting/setting.thunk";
import CartIcon from "../CartIcon";
import { getAllBrand } from "../../redux/brand/brand.thunk";

const { Header } = Layout;
const { Search } = Input;

const HeaderCustomer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { brands } = useSelector((state) => state.brand);
  const { isLoading, productSearchs } = useSelector((state) => state.product);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.cart.cart);

  const [searchText, setSearchText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const categoriesWear =
    categories?.filter((item) => item.type === "wear") || [];
  const categoriesDecorate =
    categories?.filter((item) => item.type === "decorate") || [];
  const categoriesExtra =
    categories?.filter((item) => item.type === "extra") || [];

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getSetting());
    dispatch(getAllBrand());
  }, [dispatch]);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm) {
        dispatch(getProductSearch(searchTerm));
      }
    }, 1000),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(searchText);
    return () => debouncedSearch.cancel();
  }, [searchText, debouncedSearch]);

  const handleLogout = () => {
    dispatch(logoutCustomer());
    message.success("Đăng xuất thành công");
    navigate("/");
    setMobileMenuOpen(false);
  };

  const items = [
    {
      key: "home",
      label: "Trang chủ",
      onClick: () => navigate("/"),
    },
    {
      key: "brand",
      label: "Thương hiệu",
      children: brands?.map((brand) => ({
        key: brand._id,
        label: (
          <Tooltip title={brand?.name}>
            <img
              src={brand?.image?.url}
              alt="Brand-Image"
              className="w-24 h-auto object-contain"
            />
          </Tooltip>
        ),
        onClick: () => navigate(`/brands/${brand?.slug}`),
      })),
    },
    {
      key: "categoriesWear",
      label: "Động vật thủy sinh",
      children: categoriesWear.map((category) => ({
        key: category._id,
        label: category.name,
        onClick: () => navigate(`/category/${category?.slug}`),
        children: category.children?.map((child) => ({
          key: child._id,
          label: child.name,
          onClick: () => {
            navigate(`/category/${child.slug}`);
            setMobileMenuOpen(false);
          },
        })),
      })),
    },
    {
      key: "categoriesDecorate",
      label: "Thực vật thủy sinh",
      children: categoriesDecorate.map((category) => ({
        key: category._id,
        label: category.name,
        onClick: () => navigate(`/category/${category?.slug}`),
        children: category.children?.map((child) => ({
          key: child._id,
          label: child.name,
          onClick: () => {
            navigate(`/category/${child.slug}`);
            setMobileMenuOpen(false);
          },
        })),
      })),
    },
    {
      key: "categoriesExtra",
      label: "Phụ kiện thủy sinh",
      children: categoriesExtra.map((category) => ({
        key: category._id,
        label: category.name,
        onClick: () => navigate(`/category/${category?.slug}`),
        children: category.children?.map((child) => ({
          key: child._id,
          label: child.name,
          onClick: () => {
            navigate(`/category/${child.slug}`);
            setMobileMenuOpen(false);
          },
        })),
      })),
    },
    {
      key: "about",
      label: "Giới thiệu",
      onClick: () => navigate("/about-us"),
    },
    {
      key: "contact",
      label: "Liên hệ",
      onClick: () => navigate("/contact"),
    },
  ];

  const userItems = isAuthenticated
    ? [
        {
          key: "1",
          label: "Hồ sơ",
          onClick: () => navigate("/account"),
        },
        {
          key: "2",
          label: "Đăng xuất",
          onClick: handleLogout,
        },
      ]
    : [
        {
          key: "1",
          label: "Đăng nhập",
          onClick: () => navigate("/auth"),
        },
        {
          key: "2",
          label: "Đăng ký",
          onClick: () => navigate("/auth?page=register"),
        },
      ];

  const searchContent = (
    <div className="max-h-[70vh] overflow-y-auto w-full md:w-[400px]">
      {isLoading ? (
        <div className="p-4">Đang tìm kiếm...</div>
      ) : productSearchs?.length > 0 ? (
        productSearchs.map((product) => (
          <div
            key={product._id}
            onClick={() => {
              navigate(`/detail/${product.slug}`);
              setSearchText("");
              setSearchDrawerOpen(false);
            }}
            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b"
          >
            <img
              src={product.mainImage.url}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="ml-4 flex-1">
              <div className="text-sm font-medium line-clamp-2">
                {product.name}
              </div>
              <div className="text-primary-600 mt-1">
                {formatPrice(product.price)} đ
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4">Không tìm thấy sản phẩm</div>
      )}
    </div>
  );

  const isMobile = width < 768;

  return (
    <Header className="bg-white px-12 h-auto sticky top-0 z-50 border-b shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="h-24 w-24 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="flex items-center">
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className="mr-2"
            />
          )}
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex-1 mx-8">
            <Menu mode="horizontal" items={items} />
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {isMobile ? (
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => setSearchDrawerOpen(true)}
            />
          ) : (
            <Popover
              content={searchContent}
              title="Kết quả tìm kiếm"
              trigger="click"
              open={searchText.length > 0}
              placement="bottom"
              overlayClassName="w-[400px]"
            >
              <Search
                size="large"
                placeholder="Tìm kiếm..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-96"
                allowClear
              />
            </Popover>
          )}

          {/* Cart */}
          <Badge count={products.length} size="default" color="#808080">
            <CartIcon onClick={() => navigate("/cart")} />
          </Badge>

          {/* User Menu */}
          <Dropdown menu={{ items: userItems }} placement="bottomRight">
            <Avatar
              size="large"
              src={userInfo?.avatar?.url}
              icon={userInfo?.avatar?.url ? "" : <UserOutlined />}
              className="cursor-pointer"
            />
          </Dropdown>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={280}
      >
        <Menu mode="inline" items={items} className="border-none" />
      </Drawer>

      {/* Mobile Search Drawer */}
      <Drawer
        title="Tìm kiếm"
        placement="top"
        open={searchDrawerOpen}
        onClose={() => setSearchDrawerOpen(false)}
        height="100vh"
      >
        <div className="p-4">
          <Search
            size="middle"
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full mb-4"
            allowClear
          />
          {searchText && searchContent}
        </div>
      </Drawer>
    </Header>
  );
};

export default HeaderCustomer;
