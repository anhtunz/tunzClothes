import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MessageOutlined,
    UserOutlined,
    PayCircleOutlined,
    HomeOutlined,
    ProductOutlined,
    UserAddOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, Links } from 'react-router';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;


const AdminLayout = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleOnclickMenu = (item) => {
        if (item.key == "") {
            navigate(`/${item.key}`)
            setSelectedKey(item.key)
        }
        else {
            navigate(`/manage-page/${item.key}`)
        }
    }
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    onClick={handleOnclickMenu}
                    defaultSelectedKeys={selectedKey}

                    style={{ marginTop: '50px' }}
                    items={[
                        {
                            key: '',
                            icon: <HomeOutlined />,
                            label: "Trang chủ"
                        },
                        {
                            key: '1',
                            icon: <PayCircleOutlined />,
                            label: 'Quản lí đơn hàng',
                        },
                        {
                            key: '2',
                            icon: <MessageOutlined />,
                            label: 'Tin nhắn khách hàng',
                        },
                        {
                            key: '3',
                            icon: <UserOutlined />,
                            label: 'Quản lí người dùng',
                            children: [
                                {
                                    label: "Thêm mới người dùng",
                                    icon: <UserAddOutlined />,
                                    key: 'add-new-user'
                                },
                                {
                                    label: "Chỉnh sửa người dùng",
                                    icon: <UserSwitchOutlined />,
                                    key: 'manage-user'
                                },
                            ]
                        },
                        {
                            key: '4',
                            icon: <ProductOutlined />,
                            label: 'Quản lí sản phẩm',
                            children: [
                                {
                                    label: 'Thêm mới sản phẩm',
                                    key: 'add-new-product'
                                },
                                {
                                    label: 'Chỉnh sửa sản phẩm',
                                    key: 'manage-product'
                                }

                            ]
                        },

                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 700,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};
export default AdminLayout;