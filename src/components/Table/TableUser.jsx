import React, { useMemo } from "react";
import { Table, Avatar, Tag, Tooltip, Pagination, Switch, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { formatDateReview } from "../../helpers/formatDate";
import { useDispatch } from "react-redux";
import { getUserList, updateUserAdmin } from "../../redux/user/user.thunk";

const TableUser = ({
  users = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
}) => {
  const dispatch = useDispatch();

  const handleToggleStatus = ({ id, isActive }) => {
    dispatch(updateUserAdmin({ id, payload: { isActive } })).then((res) => {
      if (res.payload.success) {
        message.success(res.payload.message);
        dispatch(
          getUserList({
            page: 1,
            pageSize: 10,
            totalPage: 0,
            totalItems: 0,
            search: "",
            status: "",
          })
        );
      }
    });
  };
  
  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "index",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Ảnh",
        dataIndex: "avatar",
        key: "avatar",
        render: (avatar) => (
          <Avatar
            src={avatar?.url}
            icon={!avatar?.url && <UserOutlined />}
            alt="Avatar"
          />
        ),
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (name) => (
          <Tooltip title={name}>
            <span className="truncate max-w-[150px]">{name}</span>
          </Tooltip>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive) => (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "Hoạt động" : "Không hoạt động"}
          </Tag>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => formatDateReview(date),
      },
      {
        title: "Thao tác",
        key: "action",
        render: (_, record) => (
          <div className="flex space-x-3 items-center">
            <Tooltip title={record.isActive ? "Vô hiệu hóa" : "Kích hoạt"}>
              <Switch
                checked={record.isActive}
                onChange={(checked) =>
                  handleToggleStatus({ id: record._id, isActive: checked })
                }
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [page, pageSize]
  );

  const handleChangePage = (key, value) => {
    setPaginate((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {users.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page) => handleChangePage("page", page)}
            onShowSizeChange={(_, size) => handleChangePage("pageSize", size)}
            showSizeChanger
          />
        </div>
      )}
    </>
  );
};

export default React.memo(TableUser);
