import { message, Pagination, Popconfirm, Table, Tooltip } from "antd";
import React, { useMemo, useState } from "react";
import { MdOutlineDeleteOutline, MdOutlineQuickreply } from "react-icons/md";
import { formatDateReview } from "../../helpers/formatDate";
import ModalReplyContact from "../Modal/ModalReplyContact";
import { useDispatch } from "react-redux";
import {
  deleteContact,
  getContactList,
} from "../../redux/contact/contact.thunk";

const TableContact = ({
  contacts = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({});

  const removeContact = async (id) => {
    const res = await dispatch(deleteContact(id)).unwrap();
    if (res.success) {
      message.success(res.message);
      dispatch(getContactList({ page, pageSize }));
    }
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
        title: "Họ và tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Nội dung",
        dataIndex: "message",
        key: "message",
      },
      {
        title: "Trả lời",
        dataIndex: "reply",
        key: "reply",
        render: (reply) => (
          <div>
            {!reply && <div>Chưa phản hồi</div>}
            {reply && <div>Đã phản hồi </div>}
          </div>
        ),
      },
      {
        title: "Ngày gửi",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => formatDateReview(date),
      },
      {
        title: "Thao Tác",
        key: "action",
        width: 120,
        fixed: "right",
        render: (_, record) => (
          <div className="flex gap-2 items-center text-[#00246a]">
            <Tooltip title="Trả lời">
              <button
                onClick={() => {
                  if (record.reply) {
                    message.warning("Đã phản hồi liên hệ");
                    return;
                  }
                  setItem(record);
                  setOpen(true);
                }}
                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
              >
                <MdOutlineQuickreply />
              </button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title="Xác nhận xóa thông tin liên hệ"
              description={record.name}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => removeContact(record._id)}
              destroyTooltipOnHide={true}
            >
              <Tooltip title="Xóa">
                <button className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors">
                  <MdOutlineDeleteOutline />
                </button>
              </Tooltip>
            </Popconfirm>
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
      <ModalReplyContact
        {...{
          open,
          setOpen,
          item,
        }}
      />
      <Table
        columns={columns}
        dataSource={contacts}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {contacts.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page) => handleChangePage("page", page)}
            onShowSizeChange={(_, size) => handleChangePage("pageSize", size)}
          />
        </div>
      )}
    </>
  );
};

export default TableContact;
