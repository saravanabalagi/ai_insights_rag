import { ResponseContext } from "@/contexts/Responses.jsx";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Modal } from "antd";
import { useContext, useState } from "react";

const ChatsList = () => {
  const {
    chats,
    currentChat,
    setCurrentChat,
    renameChat,
    deleteChat,
  } = useContext(ResponseContext);

  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [renameIndex, setRenameIndex] = useState(null);
  const [newName, setNewName] = useState("");

  const handleRename = (e, index) => {
    e.domEvent.stopPropagation();
    setRenameIndex(index);
    setNewName(chats[index].name);
    setIsRenameModalVisible(true);
  };

  const handleDelete = (e, index) => {
    e.domEvent.stopPropagation();
    deleteChat(index);
  };

  const handleRenameOk = () => {
    renameChat(renameIndex, newName);
    setIsRenameModalVisible(false);
    setNewName("");
  };

  const handleRenameCancel = () => {
    setIsRenameModalVisible(false);
    setNewName("");
  };

  return (
    <div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "12px",
          color: "#999",
          padding: "10px 20px",
        }}
      >
        History
      </div>
      <div className="chats-sidebar">
        {Object.entries(chats).map(([k, v]) => (
          <div
            key={k}
            className={`chat-item ${currentChat === k ? "active" : ""}`}
            onClick={() => setCurrentChat(Number(k))}
          >
            <div>
              {v.name}
            </div>
            <div className="action-dropdown">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "rename",
                      label: "Rename",
                      onClick: (e) => handleRename(e, k),
                    },
                    {
                      key: "delete",
                      label: "Delete",
                      onClick: (e) => handleDelete(e, k),
                    },
                  ],
                }}
              >
                <Button
                  variant="link"
                  color="default"
                  style={{
                    rotate: "90deg",
                    marginRight: "-10px",
                  }}
                  icon={<MoreOutlined />}
                />
              </Dropdown>
            </div>
          </div>
        ))}
      </div>
      <Modal
        title="Rename Chat"
        open={isRenameModalVisible}
        onOk={handleRenameOk}
        onCancel={handleRenameCancel}
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={"New name"}
        />
      </Modal>
    </div>
  );
};

export default ChatsList;
