import useModels from "@/hooks/useModels.js";
import useSelectModel from "@/hooks/useSelectModel.js";
import { CheckCircleFilled, DownOutlined } from "@ant-design/icons";
import { Dropdown, Form, Input, Modal, Space } from "antd";
import { useState } from "react";

const toMenuItems = (models, model, handleMenuItemClick) => {
  return models.map((m) => ({
    key: m.id,
    label: (
      <div
        key={m.id}
        className="p-2"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={() => handleMenuItemClick(m)}
      >
        <div>
          <div>{m.name}</div>
          <div
            style={{
              fontSize: "12px",
              color: "#BBB",
            }}
          >
            {m.description}
          </div>
        </div>
        <div className="pl-4">
          {m.model === model && <CheckCircleFilled />}
        </div>
      </div>
    ),
  }));
};

const chosenModel = (models, model) => {
  return models.find((m) => m.model === model);
};

const ChooseModel = () => {
  const { models, model, loading, error } = useModels();
  const { selectModel } = useSelectModel();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedModelLoading, setSelectedModelLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleMenuItemClick = (m) => {
    if (m.model === model) return;
    setSelectedModel(m);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setSelectedModelLoading(true);
    await selectModel(selectedModel.model, apiKey);
    setSelectedModelLoading(false);
    setIsModalVisible(false);
    setApiKey("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setApiKey("");
  };

  return (
    <>
      {error && <div>Error loading models</div>}
      <Dropdown
        menu={{ items: toMenuItems(models, model, handleMenuItemClick) }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <div
              style={{ fontSize: "18px", color: "#AAA", fontWeight: "bold" }}
            >
              {loading ? "Loading..." : chosenModel(models, model)?.name}
            </div>
            <DownOutlined
              style={{
                color: "#AAA",
                fontSize: "12px",
                transform: "scaleY(0.7) translateY(2px)",
              }}
            />
          </Space>
        </a>
      </Dropdown>
      <Modal
        title={`Enter API Key`}
        open={isModalVisible}
        onOk={handleOk}
        confirmLoading={selectedModelLoading}
        onCancel={handleCancel}
      >
        <div className="py-4">
          In order to use "
          {selectedModel?.name}", you need to enter your Together AI API. This
          key will not be stored and will only be used to make requests to the
          model.
        </div>
        <Form.Item
          name="api_key"
          label="Together AI API Key"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="ask20dbkerk"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ChooseModel;
