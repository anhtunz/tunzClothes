import { Menu, Typography, Search } from "antd";
import { Drawer } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Badge } from "antd";
import { UserOutlined, ShoppingCartOutlined, TagOutlined, PlusOutlined, MinusOutlined, BarsOutlined, HomeOutlined } from "@ant-design/icons";
import { Input, Card, Button, Image, Flex, Row, Col, Modal, message } from 'antd';
import { Popover } from "antd";
import "./Header.css"
// import { getUserData, getCartItemByUID, getProductByID, increaseQuantityProductInCart } from "../APi";
import { getCartItemByUID, getProductByID, getUserData, increaseQuantityProductInCart, decreaseQuantityProductInCart, deleteProductInCart, getAllCatergory, getAllChildCategory } from "../APi";

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

    const fetchData = async () => {
        try {
            const categoryData = await getAllCatergory();
            setCategory(categoryData)
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

    const fetchCategoryDetail = async () => {
        try {
            const details = [];
            for (const categoryItem of category) {
                const childValues = await getAllChildCategory(categoryItem.id);
                details.push({
                    categoryId: categoryItem.id,
                    details: childValues
                });
            }
            setCategoryDetail(details)
        } catch (error) {
            console.log("Error gectchCatregoryDetail: " + error.message);
        }
    }

    useEffect(() => {

        fetchData();
    }, []);
    useEffect(() => {
        if (category.length > 0) {
            fetchCategoryDetail();
        }
    }, [category])

    // console.log("Category: ", category);
    const renderTabs = () => {
        return category.map(categoryItem => {
            const categoryDetailItem = categoryDetail.find(item => item.categoryId === categoryItem.id);
            const children = categoryDetailItem ? categoryDetailItem.details : [];
            return {
                label: categoryItem.category_name,
                key: categoryItem.path,
                children: children.map(childItem => ({
                    label: childItem.detail_name,
                    key: childItem.id
                }))
            };
        });
    };

    const menuItems = [
        {
            icon: <HomeOutlined />,
            label: "Trang chủ",
            key: "",


        },
        {
            icon: <TagOutlined />,
            label: "Sale",
            key: "onSale",
        },
        ...renderTabs()
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
                style={{
                    width: "30%",
                }}
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
    }, []);


    const renderMenu = () => {
        if (isLogin && userData?.role == "USER") {
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
        } else if (isLogin && userData?.role == "ADMIN" || isLogin && userData?.role == "MANAGER") {
            return (
                <Menu
                    onClick={onMenuClick}
                    mode="vertical"
                    items={[
                        {
                            label: "Quản lí cửa hàng",
                            key: "manage-page/manage-order"
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

    const [cartItem, setCartItem] = useState(null);
    const [cartData, setCartData] = useState([]);
    const items = []
    const [cartFullData, setCartFullData] = useState([]);
    const fetchCartItem = async (uid) => {
        console.log("Đã gọi hàm lấy CartData");
        try {
            const cartItemData = await getCartItemByUID(uid);
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

    const fetchProductDataForCartItems = async () => {
        // console.log("Goi ham featchProduct");
        const updatedCartData = [];
        for (const item of cartData) {
            try {
                const productData = await getProductByID(item.id);
                const updatedItem = { ...item, productData };
                updatedCartData.push(updatedItem);
            } catch (error) {
                console.error('Error fetching product data for cart item:', error);
            }
        }
        setCartFullData(updatedCartData);
    };



    const [badgeopen, setBadgeOpen] = useState(false);
    const showDrawer = async () => {
        setBadgeOpen(true);
        fetchCartItem(uid);
    };
    const onClose = () => {
        setBadgeOpen(false);
    };

    useEffect(() => {
        if (uid !== "") {
            try {
                fetchCartItem(uid);
            } catch (error) {
                console.error('Error fetching cart item:', error);
            }
        }
    }, [uid]);
    // console.log(cartData);

    useEffect(() => {
        if (cartData.length > 0) {
            fetchProductDataForCartItems();
        }
    }, [cartData]);
    // console.log("CarttData: ", cartFullData);
    return (
        <div
            style={{
                padding: 10
            }}
        >
            <Badge
                count={cartFullData?.length}
                onClick={showDrawer} >
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
                footer={<CartFooter product={cartFullData} setOpen={onClose} />}
            >
                {cartFullData?.map((cart, index) => (
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
                            title={<strong>{cart.productData.pr_name}</strong>}
                            description={<CardDescription
                                product={cart}
                                fetchData={fetchCartItem}
                                uid={uid}
                            />}

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

function CardDescription({ product, fetchData, uid }) {
    const ButtonGroup = Button.Group;
    const salePrice = parseInt((product?.productData.pr_price - (product?.productData.pr_price * product?.productData.pr_sale) / 100))
    const [count, setCount] = useState(product?.quantity);
    const increase = async () => {
        setCount(count + 1);
        await increaseQuantityProductInCart(uid, product.id, product.color, product.size)
        fetchData(uid);
    };
    console.log("Count: ", count);
    const decline = async () => {
        let newCount = count - 1;
        if (newCount === 0) {
            Modal.confirm({
                title: "Bạn chắc chắn muốn xóa sản phẩm khỏi giỏ hàng?",
                onOk: async () => {
                    await deleteProductInCart(uid, product.id, product.color, product.size);
                    message.success('Xóa sản phẩm khỏi giỏ hàng thành công');
                    fetchData(uid);
                },
                onCancel: () => {
                    newCount++;
                }
            });
        } else {
            // newCount > 0, nên gọi hàm decreaseQuantityProductInCart để giảm số lượng sản phẩm trong giỏ hàng
            await decreaseQuantityProductInCart(uid, product.id, product.color, product.size);
            // Cập nhật số lượng mới
            setCount(newCount);
            // Sau khi giảm số lượng, cập nhật cartData
            fetchData(uid);
        }
    };
    return (
        <Flex vertical={'vertical'} gap={10}>
            <Row gutter={[16, 16]}>
                <Col span={14} style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {product?.color} / {product?.size}
                </Col>
                <Col span={3} ></Col>
                <Col span={3} ></Col>
                <Col span={4} ></Col>
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
                        {product?.productData.pr_sale === 0 ? (
                            <span style={{
                                color: 'orangered'
                            }}>{((salePrice * product.quantity) || '0')?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ",000đ"}</span>
                        ) : (
                            <>
                                <span style={{
                                    color: 'orangered'
                                }}>{(salePrice * product.quantity).toLocaleString() + ",000đ"}</span>
                                <span style={{
                                    textDecoration: 'line-through'
                                }}>{((product?.productData.pr_price * product?.quantity) || '0')?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ",000đ"}</span>
                            </>
                        )}
                    </Row>
                </Col>
            </Row>
        </Flex>
    )
}

function CartFooter({ product, setOpen }) {
    const navigate = useNavigate();
    let totalPrice = 0;
    for (const item of product) {
        let salePrice = (parseInt((item.productData.pr_price - (item.productData.pr_price * item.productData.pr_sale) / 100)) * item.quantity)
        totalPrice = totalPrice + salePrice
    }
    const handleCheckout = () => {
        setOpen();
        navigate('checkout', { state: { product } });
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
                <Button
                    onClick={handleCheckout}
                    type="primary" block danger>
                    THANH TOÁN
                </Button>
            </Row>
        </Flex>
    )
}

export default Header;