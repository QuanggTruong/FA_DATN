import { Button, Card, Empty, message, Space, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSetting, updateSetting } from "../../redux/setting/setting.thunk";
import { HighlightOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import TurndownService from "turndown";
import { setSetting } from "../../redux/setting/setting.slice";

const ManageSetting = () => {
  const mdParser = new MarkdownIt();
  const turndownService = new TurndownService();
  const dispatch = useDispatch();
  const { address, aboutUs, isLoading, id } = useSelector(
    (state) => state.setting
  );
  const [isEdit, setIsEdit] = useState({
    aboutUs: false,
    address: false,
  });
  const [addressInput, setAddressInput] = useState("");
  const [aboutUsInput, setAboutUsInput] = useState("");
  const [addressPayload, setAddressPayload] = useState("");
  const [aboutUsPayload, setAboutUsPayload] = useState("");

  useEffect(() => {
    dispatch(getSetting());
  }, []);

  useEffect(() => {
    if (address) {
      const markdownAddress = turndownService.turndown(address);
      setAddressInput(markdownAddress);
    }
    if (aboutUs) {
      const markdownAboutUs = turndownService.turndown(aboutUs);
      setAboutUsInput(markdownAboutUs);
    }
  }, [address, aboutUs]);

  if (isLoading) return <Spin size="large" className="m-auto py-2" />;

  const handleChangeEdit = (key, value) => {
    setIsEdit((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeAddress = ({ html, text }) => {
    setAddressInput(text);
    setAddressPayload(html);
  };

  const handleChangeAboutUs = ({ html, text }) => {
    setAboutUsInput(text);
    setAboutUsPayload(html);
  };

  const handleUpdate = async ({ key, data }) => {
    const res = await dispatch(
      updateSetting({ id: data.id, data: { [key]: data[key] } })
    ).unwrap();
    if (res.success) {
      message.success(res.message);
      dispatch(setSetting(res.data));
      setIsEdit((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-2 py-4">
      <Card
        title={
          <Space className="flex items-center justify-between flex-wrap py-2">
            <Title level={5}>Thông tin địa chỉ</Title>
            <Tooltip title="Sửa">
              <Button onClick={() => handleChangeEdit("address", true)}>
                <HighlightOutlined />
              </Button>
            </Tooltip>
          </Space>
        }
      >
        {!address && !isEdit.address && (
          <Empty description="Chưa có thông tin địa chỉ" />
        )}
        {!isEdit.address && address && (
          <div
            dangerouslySetInnerHTML={{ __html: address }}
            className="prose max-w-none"
          />
        )}
        {isEdit.address && (
          <div className="space-y-2">
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              value={addressInput}
              onChange={handleChangeAddress}
            />
            <div className="flex items-center justify-end gap-4">
              <button
                className="bg-slate-200 hover:bg-slate-50 text-slate-900 px-4 py-3 rounded-md uppercase"
                type="button"
                onClick={() => handleChangeEdit("address", false)}
              >
                Hủy
              </button>
              <button
                className="bg-black hover:bg-slate-800 text-white px-4 py-3 rounded-md uppercase"
                type="button"
                onClick={() =>
                  handleUpdate({
                    key: "address",
                    data: {
                      id,
                      address: addressPayload,
                    },
                  })
                }
              >
                Cập nhật
              </button>
            </div>
          </div>
        )}
      </Card>
      <Card
        title={
          <Space className="flex items-center justify-between flex-wrap py-2">
            <Title level={5}>Thông tin giới thiệu</Title>
            <Tooltip title="Sửa">
              <Button onClick={() => handleChangeEdit("aboutUs", true)}>
                <HighlightOutlined />
              </Button>
            </Tooltip>
          </Space>
        }
      >
        {!aboutUs && !isEdit.aboutUs && (
          <Empty description="Chưa có thông tin giới thiệu" />
        )}
        {!isEdit.aboutUs && aboutUs && (
          <div
            dangerouslySetInnerHTML={{ __html: aboutUs }}
            className="prose max-w-none"
          />
        )}
        {isEdit.aboutUs && (
          <div className="space-y-2">
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              value={aboutUsInput}
              onChange={handleChangeAboutUs}
            />
            <div className="flex items-center justify-end gap-4">
              <button
                className="bg-slate-200 hover:bg-slate-50 text-slate-900 px-4 py-3 rounded-md uppercase"
                type="button"
                onClick={() => handleChangeEdit("aboutUs", false)}
              >
                Hủy
              </button>
              <button
                className="bg-black hover:bg-slate-800 text-white px-4 py-3 rounded-md uppercase"
                type="button"
                onClick={() =>
                  handleUpdate({
                    key: "aboutUs",
                    data: {
                      id,
                      aboutUs: aboutUsPayload,
                    },
                  })
                }
              >
                Cập nhật
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ManageSetting;
