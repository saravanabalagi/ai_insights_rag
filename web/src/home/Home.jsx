import Chat from "@/home/content/Chat.jsx";
import FileUpload from "@/home/content/FileUpload.jsx";
import QueryInput from "@/home/content/QueryInput.jsx";
import { Layout } from "antd";
import { useState } from "react";
import Header from "./header/Header.jsx";
import SideBar from "./sidebar/Sidebar.jsx";
const { Header: HeaderMeta, Footer, Sider, Content } = Layout;

const layoutStyle = {
  textAlign: "center",
  backgroundColor: "inherit",
};
const siderStyle = {
  textAlign: "left",
  lineHeight: "120px",
  color: "#eee",
  backgroundColor: "#151515",
  zIndex: 2,
};
const headerStyle = {
  padding: "0 30px",
  backgroundColor: "inherit",
};
const footerStyle = {
  backgroundColor: "inherit",
  padding: "10px 0",
};
const mainLayoutStyle = {
  padding: "10px 50px",
  backgroundColor: "inherit",
  maxWidth: "1200px",
  minWidth: "60%",
  alignSelf: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flex: 1,
};
const contentStyle = {
  backgroundColor: "inherit",
};

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <Layout style={layoutStyle}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          collapsedWidth={0}
          breakpoint="lg"
          width={260}
          style={siderStyle}
          trigger={null}
        >
          <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        </Sider>
        <Layout style={layoutStyle}>
          <HeaderMeta style={headerStyle}>
            <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          </HeaderMeta>
          <Layout style={contentStyle}>
            <div style={mainLayoutStyle}>
              <Content style={contentStyle}>
                <FileUpload />
                <Chat />
              </Content>
              <Footer style={footerStyle}>
                <QueryInput />
              </Footer>
            </div>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default Home;
