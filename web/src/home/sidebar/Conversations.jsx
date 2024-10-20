import { ResponseContext } from "@/contexts/Responses.jsx";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useContext } from "react";

const ConversationsSidebar = () => {
  const { conversations, currentConversation, setCurrentConversation } =
    useContext(ResponseContext);

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
      <div className="conversations-sidebar">
        {conversations.map((_, i) => (
          <div
            key={i}
            className={`conversation-item ${
              currentConversation === i ? "active" : ""
            }`}
            onClick={() => setCurrentConversation(i)}
          >
            <div>
              {i === conversations.length - 1
                ? "New Conversation"
                : "Conversation " + (i + 1)}
            </div>
            <div className="action-dropdown">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "edit",
                      label: "Edit",
                    },
                    {
                      key: "delete",
                      label: "Delete",
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
    </div>
  );
};

export default ConversationsSidebar;
