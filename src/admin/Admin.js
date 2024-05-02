import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BarChartOutlined,
    UserOutlined,
    PayCircleOutlined,
    HomeOutlined,
    ProductOutlined,
    UserAddOutlined,
    UserSwitchOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Image } from 'antd';
import { Outlet, Links } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../APi';

const { Header, Sider, Content } = Layout;


const AdminLayout = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [userData, setUserData] = useState(null)

    const handleOnclickMenu = (item) => {
        if (item.key == "") {
            navigate(`/${item.key}`)
            setSelectedKey(item.key)
        }
        else {
            navigate(`/manage-page/${item.key}`)
        }
    }

    const uid = localStorage.getItem("uid");
    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserData(uid);
            setUserData(data);
        };

        fetchData();
    }, []);

    const renderMenu = () => {
        if (userData?.role === "ADMIN") {
            return (
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
                            key: 'manage-order',
                            icon: <PayCircleOutlined />,
                            label: 'Quản lí đơn hàng',
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
                        {
                            key: 'manage-success-bills',
                            icon: <HistoryOutlined />,
                            label: 'Lịch sử mua hàng',
                        },
                        {
                            key: 'manage-statistical',
                            icon: <BarChartOutlined />,
                            label: 'Thống kê',
                        },

                    ]}
                />
            )
        } else {
            return (
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
                            key: 'manage-order',
                            icon: <PayCircleOutlined />,
                            label: 'Quản lí đơn hàng',
                        },
                    ]}
                />
            )
        }
    }

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <div className="demo-logo-vertical" />
                {renderMenu()}
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
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
                    </div>
                    <div>
                        <Image
                            style={{
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                navigate('/')
                            }}
                            preview={false}
                            height={70}
                            src={'https://firebasestorage.googleapis.com/v0/b/tunztunzzclothing.appspot.com/o/logo-Photoroom.png-Photoroom.png?alt=media&token=41f23438-d0f9-4b0d-9286-704bf35a9e63'}
                        />
                    </div>
                    <div style={{ marginRight: 10 }}>
                        <Button
                            onClick={() => {
                                navigate('/logout')
                            }}
                            type='primary'
                            danger
                        >Đăng xuất</Button>
                    </div>
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