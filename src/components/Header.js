import { Menu, Typography, Search } from "antd";
import { Drawer } from "antd";
import { useState, useEffect } from "react";
// import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import "./Header.css"
import { Badge } from "antd";
import { UserOutlined, ShoppingCartOutlined, TagOutlined, PlusOutlined, MinusOutlined, BarsOutlined } from "@ant-design/icons";
import { Input, Card, Button, Image, Flex, Row, Col } from 'antd';
import { Popover } from "antd";
import { getAllCatergory, getUserData, getCartItemByUID, getProductByID, increaseQuantityAndUpdateFirestore, getAllChildCategory } from "../APi";
import { auth } from "../Services/firebase";
import { signOut } from "firebase/auth";

function Header() {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <div className='appHeader'>
            <div
                style={{
                    height: 60,
                    paddingLeft: 12,
                    paddingTop: 12,
                }}
                className="menuIcon"
            >
                <BarsOutlined
                    style={{
                        color: "black",
                        fontSize: 35,
                    }}
                    onClick={() => {
                        setOpenMenu(true)
                    }}
                />
            </div>
            <span className="headerMenu">
                <AppMenu />
            </span>
            <Drawer
                placement="left"
                open={openMenu}
                onClose={() => {
                    setOpenMenu(false)
                }}
                closable={false}
            >
                <AppMenu isInLine />
            </Drawer>
        </div>
    );
}

function AppMenu({ isInLine = false }) {
    const navigate = useNavigate();

    const onMenuClick = (item) => {
        if (item.key == "") {
            navigate(`/${item.key}`)
        }
        else {
            navigate(`/collection/${item.key}`, { state: { key: `${item.key}` } })
        }
    }
    const { Search } = Input;
    const onSearch = (value) => {
        navigate(`/search/query=${value}`, {
            state: { query: value }
        })
    };
    const [category, setCategory] = useState([])
    const [categoryDetail, setCategoryDetail] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const categoryData = await getAllCatergory();
            setCategory(categoryData)
            const details = [];
            for (const categoryItem of categoryData) {
                const childValues = await getAllChildCategory(categoryItem.id);
                details.push({
                    categoryId: categoryItem.id,
                    details: childValues
                });
            }
            setCategoryDetail(details)
        };
        fetchData();
    }, []);



    console.log("Category: ", category);
    const renderTabs = () => {
        return category.map(categoryItem => {
            const categoryDetailItem = categoryDetail.find(item => item.categoryId === categoryItem.id);
            const children = categoryDetailItem ? categoryDetailItem.details : [];
            return {
                label: categoryItem.category_name,
                key: categoryItem.id,
                children: children.map(childItem => ({
                    label: childItem.detail_name,
                    key: childItem.id
                }))
            };
        });
    };
    console.log("RenderTab: ", renderTabs);
    const menuItems = [
        {
            // icon: <HomeIcon />,
            label: "Trang chủ",
            key: "",


        },
        {
            // icon: <TagOutlined />,
            label: "Sale",
            key: "sale",
        },
        // ...renderTabs()
    ];
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <Menu
                onClick={onMenuClick}
                mode={isInLine ? "inline" : "horizontal"}
                items={
                    menuItems
                }
            >
            </Menu>
            <Search
                style={{
                    width: 300
                }}
                placeholder="Tìm kiếm..."
                onSearch={onSearch}
                enterButton
                allowClear
            />
            <AppCart />
        </div>

    )

}

function AppCart() {
    const { Meta } = Card;
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false)
    const [userData, setUserData] = useState(null)
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const uid = localStorage.getItem("uid");
    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserData(uid);
            setUserData(data);
        };

        fetchData();
    }, []);

    const onMenuClick = (item) => {
        if (item.key == "logout") {
            navigate("/logout")
        }
        else {

            navigate(`/${item.key}`)
        }
        // console.log(item.key);
    }

    useEffect(() => {
        const checkLogin = () => {
            if (uid !== null && uid !== "") {
                setIsLogin(true);
            } else {
                setIsLogin(false);
            }
        };

        checkLogin();
    }, [isLogin]);


    const renderMenu = () => {
        if (isLogin && userData.role == "USER") {
            return (
                <Menu
                    onClick={onMenuClick}
                    mode="vertical"
                    items={[
                        {
                            label: "Trang cá nhân",
                            key: "user/profile"
                        },
                        {
                            label: "Đổi mật khẩu",
                            key: "user/change-pass"
                        },
                        {
                            label: "Đăng xuất",
                            key: "logout"
                        }
                    ]}
                />
            );
        } else if (isLogin && userData.role == "ADMIN" || isLogin && userData.role == "MANAGER") {
            return (
                <Menu
                    onClick={onMenuClick}
                    mode="vertical"
                    items={[
                        {
                            label: "Quản lí đơn hàng",
                            key: "manage-page/manage-user"
                        },
                        {
                            label: "Trang cá nhân",
                            key: "user/profile"
                        },
                        {
                            label: "Đổi mật khẩu",
                            key: "user/change-pass"
                        },
                        {
                            label: "Đăng xuất",
                            key: "logout"
                        }
                    ]}
                />
            )
        }
        else {
            return (
                <Menu
                    onClick={onMenuClick}
                    mode="vertical"
                    items={[
                        {
                            label: "Đăng nhập",
                            key: "login"
                        },
                    ]}
                />
            );
        }
    };

    const [badgeopen, setBadgeOpen] = useState(false);
    const showDrawer = () => {
        setBadgeOpen(true);
    };
    const onClose = () => {
        setBadgeOpen(false);
    };

    const handleBadgeClick = () => {

    }
    const [cartItem, setCartItem] = useState({});
    const [cartData, setCartData] = useState([]);
    const items = []
    const [cartFullData, setCartFullData] = useState([]);
    useEffect(() => {
        const fetchCartItem = async () => {
            try {
                const cartItemData = await getCartItemByUID('CSnQNSTddHV566sgdldSULWA9XN2');
                setCartItem(cartItemData);
                if (cartItemData && cartItemData.items) {
                    setCartData(cartItemData.items);
                } else {
                    setCartData(items);
                }
            } catch (error) {
                console.error('Error fetching cart item:', error);
            }
        };

        fetchCartItem();
    }, [cartItem]);
    const fetchProductDataForCartItems = async () => {
        const updatedCartData = [];
        for (const item of cartData) {
            try {
                console.log("cartData: " + item.pr_id);
                const productData = await getProductByID(item.pr_id);
                // Kết hợp dữ liệu sản phẩm với dữ liệu của mỗi item trong cartData
                const updatedItem = { ...item, productData };
                // // Thêm updatedItem vào mảng updatedCartData
                updatedCartData.push(updatedItem);
                console.log("UpadteItem: " + updatedItem.productData.pr_name);
            } catch (error) {
                console.error('Error fetching product data for cart item:', error);
            }
        }
        // Cập nhật state cartData với updatedCartData
        setCartFullData(updatedCartData);
    };
    useEffect(() => {
        fetchProductDataForCartItems();
    }, []);

    return (
        <div
            style={{
                padding: 10
            }}
        >
            <Badge count={cartFullData.length} onClick={showDrawer} >
                <ShoppingCartOutlined
                    style={{
                        fontSize: 25
                    }}
                />
            </Badge>
            <Drawer
                title="Giỏ hàng"
                onClose={onClose}
                open={badgeopen}
                width={510}
                footer={<CartFooter product={cartFullData} />}
            >

                {cartFullData.map((cart, index) => (
                    <Card key={index} style={{ width: 470 }}>
                        <Card.Meta
                            avatar={
                                <Image
                                    preview={false}
                                    width={120}
                                    height={'90%'}
                                    src={cart.productData.pr_images[0]}
                                    style={{ objectFit: 'fill' }}
                                />
                            }
                            title={<strong>{cart.productData.pr_name}</strong>} // Thay thế bằng dữ liệu title thích hợp từ dữ liệu item
                            description={<CardDescription product={cart} length={cartFullData.length} />}
                        />
                    </Card>
                ))}
            </Drawer>

            <Popover
                content={
                    renderMenu
                }
                title={`Chào ${userData && userData.username ? userData.username : (userData && userData.email ? userData.email : 'Khách hàng')}!`}
                open={open}
                onOpenChange={handleOpenChange}
            >
                <UserOutlined
                    style={{
                        fontSize: 25,
                        marginLeft: 15
                    }}
                />
            </Popover>
        </div>
    )
}

function CardDescription({ product, length }) {
    const ButtonGroup = Button.Group;
    const salePrice = parseInt((product.productData.pr_price - (product.productData.pr_price * product.productData.pr_sale) / 100))

    const [count, setCount] = useState(product.quantity);
    const increase = async () => {
        setCount(count + 1);
        await increaseQuantityAndUpdateFirestore('CSnQNSTddHV566sgdldSULWA9XN2', 'CoIrYgvFqLQKRre1Bcm2', 'Đen', 'S')
        // await getCartItemByUID('CSnQNSTddHV566sgdldSULWA9XN2');
    };
    const decline = () => {
        let newCount = count - 1;
        if (newCount < 0) {
            newCount = 0;
        }
        setCount(newCount);
    };
    return (
        <Flex vertical={'vertical'} gap={10}>
            <Row gutter={[16, 16]}>
                <Col span={8} style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {product.pr_color} / {product.pr_size}
                </Col>
                <Col span={4} ></Col>
                <Col span={6} ></Col>
                <Col span={6} ></Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={6} >
                    <ButtonGroup>
                        <Button
                            onClick={decline}
                            icon={<MinusOutlined />}
                        />
                        <Button
                            disabled
                            style={{
                                fontWeight: 'bold'
                            }}
                        >
                            {count}
                        </Button>
                        <Button
                            onClick={increase}
                            icon={<PlusOutlined />}
                        />
                    </ButtonGroup>
                </Col>
                <Col span={6} ></Col>
                <Col span={5} ></Col>
                <Col span={7} flex={'auto'} >
                    <Row style={{ fontSize: 15, fontWeight: '600' }}>
                        <span style={{
                            color: 'orangered'
                        }}>{salePrice * product.quantity + ",000đ"}</span>
                        <span style={{
                            textDecoration: 'line-through'
                        }}>{(product.productData.pr_price * product.quantity).toLocaleString() + ",000đ"}</span>
                    </Row>
                </Col>
            </Row>
        </Flex>
    )
}

function CartFooter({ product }) {
    let totalPrice = 0;
    for (const item of product) {
        let salePrice = (parseInt((item.productData.pr_price - (item.productData.pr_price * item.productData.pr_sale) / 100)) * item.quantity)
        totalPrice = totalPrice + salePrice
    }
    return (
        <Flex vertical={'vertical'} gap={10} >
            <Row>
                <Col span={6} style={{ fontSize: 20, fontWeight: 'bold' }}>
                    Tổng tiền:
                </Col>
                <Col span={6} ></Col>
                <Col span={6} ></Col>
                <Col span={6} style={{
                    color: 'orangered',
                    fontWeight: 'bold',
                    fontSize: 20
                }}>
                    {totalPrice.toLocaleString() + ",000đ"}
                </Col>
            </Row>
            <Row >
                <Button type="primary" block danger>
                    THANH TOÁN
                </Button>
            </Row>
        </Flex>
    )
}

export default Header;