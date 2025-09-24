import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
import { DatabaseOutlined, CheckCircleOutlined, UploadOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

export default function CheckLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 200;
  const headerHeight = 70;
  const { pathname } = useLocation();

  const items = [    
    { key: "/check/include", icon: <CheckCircleOutlined />, label: <Link to="include">식재료 포함 여부</Link> },
    { key: "/check/db", icon: <DatabaseOutlined />, label: <Link to="db">데이터베이스</Link> },
    { key: "/check/upload", icon: <UploadOutlined />, label: <Link to="upload">파일 업로드</Link> },
  ];

  return (
    <Layout>
      <Sider 
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        theme="light"
        style={{
          position: "fixed",
          top: headerHeight,
          left: 0,
          bottom: 0,
          zIndex: 100,
          height: `calc(100vh - ${headerHeight}px)`,
          overflow: "auto",
        }}
      >
        <Menu
          mode="inline"
          style={{padding : "20px 3px"}}
          selectedKeys={[pathname]}
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: siderWidth }}>
        <Content
          style={{
            marginTop: headerHeight,
            padding: "17px",
            minHeight: `calc(100vh - ${headerHeight}px)`,
            background: "#fff",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
