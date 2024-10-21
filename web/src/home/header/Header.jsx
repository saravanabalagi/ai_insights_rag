import { ResponseContext } from "@/contexts/Responses.jsx";
import { EditOutlined, LayoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext } from "react";
import Models from "./Models.jsx";

const Header = ({ collapsed, setCollapsed }) => {
  const { startNewShat } = useContext(ResponseContext);
  const handleCollapse = () => setCollapsed(false);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {collapsed && (
          <>
            <div style={{ marginLeft: "-18px" }} />
            <Button
              variant="text"
              color="default"
              onClick={handleCollapse}
            >
              <LayoutOutlined
                style={{ fontSize: "18px", cursor: "pointer" }}
              />
            </Button>
            <Button
              variant="text"
              color="default"
              onClick={startNewShat}
            >
              <EditOutlined
                style={{ fontSize: "18px", cursor: "pointer" }}
              />
            </Button>
            <div className="mr-4" />
          </>
        )}
        <Models />
      </div>
    </div>
  );
};

export default Header;
