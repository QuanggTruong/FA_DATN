import React, { useEffect, useState } from "react";
import { Avatar, Typography, Input, Form, Upload, Button, message } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteFile, uploadFile } from "../helpers/uploadCloudinary";
import { updateAccount } from "../redux/auth/auth.thunk";
import { setUserInfo } from "../redux/auth/auth.slice";

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (userInfo) {
      setAvatar((prev) => ({
        ...prev,
        url: userInfo.avatar.url,
        publicId: userInfo.avatar.publicId,
      }));
    }
  }, []);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let avatarUpload = avatar;
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        const resUpload = await uploadFile(file);
        avatarUpload = {
          url: resUpload.secure_url,
          publicId: resUpload.public_id,
        };
      }
      const updatedUserInfo = {
        ...values,
        avatar: avatarUpload,
      };
      const res = await dispatch(updateAccount(updatedUserInfo)).unwrap();
      if (res.success) {
        const isNewAvatarUploaded =
          avatarUpload.publicId && avatarUpload.publicId !== avatar?.publicId;
        if (isNewAvatarUploaded) {
          await deleteFile(avatar.publicId);
        }

        dispatch(setUserInfo(res.data));
        message.success(res.message);
        setFileList([]);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <Avatar
            size={120}
            src={
              fileList.length > 0
                ? URL.createObjectURL(fileList[0].originFileObj)
                : avatar?.url
            }
            icon={!avatar && <UserOutlined />}
            className="border-4 border-white shadow-lg"
          />
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
            maxCount={1}
            className="absolute bottom-0 right-0"
          >
            <Button
              type="primary"
              shape="circle"
              icon={<CameraOutlined />}
              size="small"
              className="bg-blue-500"
            />
          </Upload>
        </div>
        <Title level={4} className="mt-4 mb-1">
          {userInfo?.name}
        </Title>
        <Text type="secondary">{userInfo?.email}</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: userInfo?.name,
          email: userInfo?.email,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input size="large" placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input size="large" disabled />
          </Form.Item>

          <Form.Item label="Mật khẩu mới" name="password">
            <Input.Password size="large" placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="rePassword"
            dependencies={["password"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Mật khẩu mới không khớp vui lòng thử lại"
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm new password" />
          </Form.Item>
        </div>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600"
          >
            Cập nhật ngay
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
