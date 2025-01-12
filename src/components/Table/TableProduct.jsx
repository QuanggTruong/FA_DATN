import React, { useEffect, useState } from "react";
import { Image, message, Pagination, Spin, Table, Tag, Tooltip } from "antd";
import { FaEye } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
import ModalConfirm from "../Modal/ModalConfirm";
import ModalUpdateProduct from "../Modal/ModalUpdateProduct";
import { useDispatch } from "react-redux";
import {
  deleteProduct,
  getProductAdmin,
} from "../../redux/product/product.thunk";
import { deleteFile } from "../../helpers/uploadCloudinary";
import { isArray } from "lodash";
import { formatPrice } from "../../helpers/formatPrice";

const getColorTag = (tag) => {
  switch (tag) {
    case "HOT":
      return "#eb1c26";
    case "NEW":
      return "#5bc0de";
    case "SALE":
      return "#28a745";
    case "SELLING":
      return "#fab40a";
    default:
      return "#eb1c26";
  }
};

const TableProduct = ({
  productList,
  paginate,
  loading,
  setPaginate,
  filters,
}) => {
  const dispatch = useDispatch();
  const [productItem, setProductItem] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleDeleteProduct = async (productId) => {
    const result = await dispatch(deleteProduct(productId)).unwrap();

    if (result.success) {
      const deletePromises = [];

      if (productItem.mainImage?.publicId) {
        deletePromises.push(deleteFile(productItem.mainImage.publicId));
      }

      if (productItem.images?.length > 0) {
        productItem.images.forEach((image) => {
          if (image.publicId) {
            deletePromises.push(deleteFile(image.publicId));
          }
        });
      }

      if (deletePromises.length > 0) await Promise.all(deletePromises);

      message.success(result.message);

      dispatch(
        getProductAdmin({
          ...paginate,
          ...filters,
          page: productList.length > 10 ? paginate.page : 1,
        })
      );

      setProductItem(null);
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_, __, index) =>
        (paginate.page - 1) * paginate.pageSize + index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "mainImage",
      key: "mainImage",
      width: 100,
      render: (text) => (
        <Image
          src={text.url}
          alt="Product"
          width={80}
          height={80}
          style={{ objectFit: "cover" }}
          placeholder={<Spin />}
        />
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate-2-lines">{text}</div>
        </Tooltip>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (text) => (
        <p className="font-medium text-[#820813]">{formatPrice(text)}đ</p>
      ),
    },
    {
      title: "Danh Mục",
      dataIndex: "categories",
      key: "categories",
      width: 120,
      render: (categories) => (
        <div className="font-medium flex items-center flex-wrap gap-1">
          {categories && categories.length > 0 ? (
            categories.map((item) => (
              <Tag key={item._id} color="#7e2991">
                {item.name}
              </Tag>
            ))
          ) : (
            <Tag color="#99a7bc">Không có</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "enable",
      key: "enable",
      width: 120,
      render: (text) =>
        text ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="#99a7bc">Ẩn</Tag>
        ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: 100,
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <Tag key={index} color={getColorTag(tag)}>
                {tag}
              </Tag>
            ))
          ) : (
            <Tag color="#99a7bc">Không có</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-2 items-center text-[#00246a]">
          <Tooltip title="Xem">
            <button className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors">
              <FaEye />
            </button>
          </Tooltip>
          <Tooltip title="Sửa">
            <button
              onClick={() => {
                setProductItem(record);
                setOpenEdit(true);
              }}
              className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
            >
              <GrEdit />
            </button>
          </Tooltip>

          <ModalConfirm
            title="Xác nhận xóa sản phẩm"
            description={record.name}
            handleOk={handleDeleteProduct}
            open={productItem?._id === record._id && !openEdit}
            setOpen={(open) => !open && setProductItem(null)}
            data={record}
          >
            <Tooltip title="Xóa">
              <button
                onClick={() => setProductItem(record)}
                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
              >
                <MdOutlineDeleteOutline />
              </button>
            </Tooltip>
          </ModalConfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="py-2">
      <ModalUpdateProduct
        {...{
          open: openEdit,
          data: productItem,
          setData: setProductItem,
          setOpen: setOpenEdit,
        }}
      />
      <Table
        columns={columns}
        dataSource={productList}
        rowKey={(record) => record._id}
        pagination={false}
        loading={loading}
        scroll={{ x: true }}
      />
      {productList?.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={paginate.page}
            pageSize={paginate.pageSize}
            total={paginate.totalItems}
            onChange={(page) =>
              setPaginate((prev) => ({
                ...prev,
                page,
              }))
            }
            onShowSizeChange={(_, size) =>
              setPaginate((prev) => ({
                ...prev,
                page: 1,
                pageSize: size,
              }))
            }
            showSizeChanger
          />
        </div>
      )}
    </div>
  );
};

export default TableProduct;
