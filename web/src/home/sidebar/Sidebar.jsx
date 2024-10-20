import { ResponseContext } from "@/contexts/Responses.jsx";
import ConversationsSidebar from "@/home/sidebar/Conversations.jsx";
import { EditOutlined, LayoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext } from "react";
import "./Sidebar.scss";

const SideBar = ({ setCollapsed }) => {
  const { startNewConversation } = useContext(ResponseContext);
  const handleCollapse = () => setCollapsed(true);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        lineHeight: 1,
      }}
    >
      <div
        className="p-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="text"
          color="default"
          onClick={handleCollapse}
        >
          <LayoutOutlined
            style={{ fontSize: "18px", cursor: "pointer" }}
          />
        </Button>
        <Button variant="text" color="default" onClick={startNewConversation}>
          <EditOutlined
            style={{ fontSize: "18px", cursor: "pointer" }}
          />
        </Button>
      </div>
      <ConversationsSidebar />
    </div>
  );
};

export default SideBar;
