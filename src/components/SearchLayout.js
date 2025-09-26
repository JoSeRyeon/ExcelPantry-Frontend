import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

export default function SearchLayout() {
  // ✅ 처음 로딩 시 화면 폭이 768px 이하라면 닫힌 상태로 시작
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const siderWidth = collapsed ? 80 : 200;
  const headerHeight = 70;
  const { pathname } = useLocation();

  const items = [
    { key: "/search/excel", icon: <SearchOutlined />, label: <Link to="excel">Search</Link> },
    { key: "/search/upload", icon: <UploadOutlined />, label: <Link to="upload">Upload</Link> },
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
          style={{ padding: "20px 3px" }}
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
