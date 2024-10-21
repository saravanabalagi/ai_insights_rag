import { ResponseContext } from "@/contexts/Responses.jsx";
import ChatsList from "@/home/sidebar/ChatsList.jsx";
import { EditOutlined, LayoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext } from "react";
import "./Sidebar.scss";

const SideBar = ({ setCollapsed }) => {
  const { setCurrentChat } = useContext(ResponseContext);
  const handleCollapse = () => setCollapsed(true);
  const handleNewChat = () => setCurrentChat(null);
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
        <Button variant="text" color="default" onClick={handleNewChat}>
          <EditOutlined
            style={{ fontSize: "18px", cursor: "pointer" }}
          />
        </Button>
      </div>
      <ChatsList />
    </div>
  );
};

export default SideBar;
