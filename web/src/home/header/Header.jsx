import { ResponseContext } from "@/contexts/Responses.jsx";
import { EditOutlined, LayoutOutlined } from "@ant-design/icons";
import { Button, Grid } from "antd";
import { useContext } from "react";
import "./Header.scss";
import MadeBy from "./MadeBy.jsx";
import Models from "./Models.jsx";

const getNewButton = (action) => (
  <Button
    variant="text"
    color="default"
    onClick={action}
  >
    <EditOutlined />
  </Button>
);

const Header = ({ collapsed, setCollapsed }) => {
  const screens = Grid.useBreakpoint();
  const { startNewChat } = useContext(ResponseContext);
  const handleCollapse = () => setCollapsed(false);
  return (
    <div className="header">
      <div className="model-wrapper">
        {collapsed && (
          <div className="icon-wrapper">
            <Button
              variant="text"
              color="default"
              onClick={handleCollapse}
            >
              <LayoutOutlined />
            </Button>
            {!screens.xs && getNewButton(startNewChat)}
          </div>
        )}
        <div className="dropdown-wrapper">
          <Models />
        </div>
        <div className="icon-wrapper end">
          {collapsed && screens.xs && getNewButton(startNewChat)}
        </div>
      </div>
      <MadeBy />
    </div>
  );
};

export default Header;
