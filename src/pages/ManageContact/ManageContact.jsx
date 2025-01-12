import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContactList } from "../../redux/contact/contact.thunk";
import { Card, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { MdOutlineEmail } from "react-icons/md";
import debounce from "lodash/debounce";
import TableContact from "../../components/Table/TableContact";

const ManageContact = () => {
  const dispatch = useDispatch();
  const { contacts, pagination, isLoading } = useSelector(
    (state) => state.contact
  );

  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  });

  const [filters, setFilters] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    dispatch(getContactList({ ...paginate, ...filters }));
  }, [dispatch, paginate.page, paginate.pageSize, filters]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPage: pagination.totalPage,
        totalItems: pagination.totalUsers,
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

  return (
    <div className="py-8">
      <Card className="mb-4 bg-white rounded-md shadow-lg">
        <div className="flex gap-4">
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            className="flex-1"
            type="text"
            placeholder="Họ và tên..."
            onChange={(e) => handleFilterChange("name", e.target.value)}
            allowClear
          />
          <Input
            prefix={<MdOutlineEmail className="text-gray-400" />}
            className="flex-1"
            type="text"
            placeholder="Email..."
            onChange={(e) => handleFilterChange("email", e.target.value)}
            allowClear
          />
        </div>
      </Card>
      <TableContact
        contacts={contacts}
        isLoading={isLoading}
        page={paginate.page}
        pageSize={paginate.pageSize}
        totalItems={paginate.totalItems}
        setPaginate={setPaginate}
      />
    </div>
  );
};

export default ManageContact;
