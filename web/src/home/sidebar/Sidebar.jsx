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
    <div className="sidebar">
      <div className="icon-wrapper p-4">
        <Button
          variant="text"
          color="default"
          onClick={handleCollapse}
        >
          <LayoutOutlined />
        </Button>
        <Button variant="text" color="default" onClick={handleNewChat}>
          <EditOutlined />
        </Button>
      </div>
      <ChatsList />
    </div>
  );
};

export default SideBar;
