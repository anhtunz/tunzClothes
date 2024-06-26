import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import "./Details.css"
import { Layout, Flex } from 'antd';
import { Carousel, Image, Typography, Tag, notification, message, Rate } from "antd";
import { Col, Row, Button, Modal } from 'antd';
import { MinusOutlined, PlusOutlined, QuestionOutlined } from "@ant-design/icons";
import ProductTabs from './ProductTab';
import { useParams, useLocation } from 'react-router-dom';
import { addItemToCart, getProductByID, getTop4ProductsByID } from '../../APi';
import ClothesList from '../home/ListClothes/List_Clothes';
import { useNavigate } from 'react-router-dom';

// import ReactImageMagnify from 'react-image-magnify';
function DetailsClothes() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const productID = location.state?.productID;
    const productID1 = params.productID;
    console.log("ProductID: " + productID);
    console.log("ProductID: " + productID1);
    const images = [
        'https://product.hstatic.net/200000690725/product/53320313439_ab4fc4f995_k_7c47e903b4b74e0cab7b00c7c4d13351_master.jpg',
        'https://product.hstatic.net/200000690725/product/53320428090_3c3d4e7306_k_92b3f2a3b62548bba9122d6e31923994_master.jpg',
        'https://product.hstatic.net/200000690725/product/53320428160_155354b898_h_9ac2e86cb01f446eb912c643f10e24d6_master.jpg',
        'https://product.hstatic.net/200000690725/product/53319960126_dc5abbf76d_k_e036d3ddeaf64d608af8cbbf2cb009b5_master.jpg',
        'https://product.hstatic.net/200000690725/product/53319960176_2b13d936db_k_552a73e31b874d458306c6b51ebf3661_master.jpg',
        'https://product.hstatic.net/200000690725/product/53320428075_b717cac1a3_k_bc2af750aa4747c98285b14b7f401e3c_master.jpg'
    ]
    const sizeData = ['S', 'M', 'L', 'XL'];
    const productColorData = ['Trắng', 'Đen', 'Xám', 'Nâu'];
    const uid = localStorage.getItem("uid");
    const [product, setProduct] = useState(null)
    const [productImages, setProductImages] = useState(images)
    const [productColor, setProductColor] = useState(productColorData)
    const [selectedColorTag, setSelectedColorTag] = React.useState('');
    const [selectedSizeTag, setSelectedSizeTag] = React.useState('');
    const [count, setCount] = useState(1);
    const [relatedProducts, setRelatedProducts] = React.useState([]);
    const [isLogin, setIsLogin] = useState(false)
    useEffect(() => {
        fetchData();
    }, [productID1]);

    const fetchData = async () => {
        const productData = await getProductByID(productID1);
        setProduct(productData);
        if (productData && productData.pr_images) {
            setProductImages(productData.pr_images);
        } else {
            setProductImages(images);
        }
        if (productData && productData.pr_color) {
            setProductColor(productData.pr_color);
            setSelectedColorTag(productData.pr_color[0])
        } else {
            setProductColor(productColorData);
        }
        setSelectedSizeTag(productData.pr_sizes[0])
    };
    // console.log(product);
    // console.log(product.id);
    const salePrice = parseInt((product?.pr_price - (product?.pr_price * product?.pr_sale) / 100))


    const { Sider, Content } = Layout;
    const contentStyle = {
        // textAlign: 'center',
        paddding: '10px',
        minHeight: 120,
        lineHeight: '40px',
    };
    const siderStyle = {
        textAlign: 'center',
        lineHeight: '120px',
    };
    const layoutStyle = {
        borderRadius: 8,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        margin: '5px',
        backgroundColor: 'white'
    };



    const handleColorChange = (tag) => {
        const isPreviouslySelected = selectedColorTag === tag;

        if (!isPreviouslySelected) {
            setSelectedColorTag(tag);
        } else {
            setSelectedColorTag('');
        }
    };
    const handleSizeChange = (tag) => {
        const isPreviouslySelected = selectedSizeTag === tag;

        if (!isPreviouslySelected) {
            setSelectedSizeTag(tag);
            console.log('You are interested in: ', tag);
        } else {
            setSelectedSizeTag('');
            console.log('Tag has been deselected');
        }
    };
    // Hiển thị bảng chọn Size
    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        api.open({
            message: 'Hướng dẫn chọn size',
            description:
                <Image
                    src="https://detmayduongngoc.com/upload_images/files/cach_tinh_size_quan_ao_bao_ho.jpg">

                </Image>,
            icon: (
                < QuestionOutlined
                    style={{
                        color: '#108ee9',
                    }}
                />
            ),
            duration: 3
        });
    };

    const increase = () => {
        setCount(count + 1);
    };
    const decline = () => {
        let newCount = count - 1;
        if (newCount < 1) {
            newCount = 1;
        }
        setCount(newCount);
    };

    // lấy 4 sản phẩm liên quan

    const get4ProductsRelated = async () => {
        try {
            const relatedProducts = await getTop4ProductsByID(product?.category_detail)
            setRelatedProducts(relatedProducts)
        } catch (error) {
            console.log("Error get4ProductsRelated: ", error.message);
        }
    }

    useEffect(() => {
        get4ProductsRelated()
    }, [product?.category_detail])
    console.log("Top 4 product Realated: ", relatedProducts);
    return (
        <Layout style={layoutStyle}>
            <Layout
                style={{
                    marginBottom: '50px'
                }}
            >
                {/* Sile anh */}
                <Sider width="25%" style={siderStyle}>
                    <Carousel
                        autoplay
                    >
                        {
                            productImages.map(image => (
                                // images.map(image => (
                                <div
                                    style={{ width: "100%", height: "100%" }}
                                // onClick={() => handleImageClick(image)}
                                >
                                    <Image
                                        src={image}
                                        style={{ width: "100%", height: "100%", objectFit: "fill" }}
                                    />
                                </div>
                            ))}
                    </Carousel>
                </Sider>
                <Content style={contentStyle}>
                    <Row>
                        <Col
                            span={18}
                            style={{
                                paddingLeft: '20px'
                            }}
                        >
                            {/* Tên áo */}
                            <Typography.Title
                                strong
                                level={3}>
                                {product?.pr_name}
                            </Typography.Title >
                            {/* Mã + Tình Trạng */}
                            <Flex justify="flex-start" align='flex-start' gap={'small'}>
                                <Col>
                                    <Typography.Text>
                                        Mã sản phẩm : <strong>{productID}</strong>
                                    </Typography.Text>
                                </Col>
                                <Col>
                                    <Typography.Text>
                                        |
                                    </Typography.Text>
                                </Col>
                                <Col>
                                    <Typography.Text>
                                        Tình trạng : <strong>{product?.pr_status === true ? 'Còn hàng' : 'Hết hàng'}</strong>
                                    </Typography.Text>
                                </Col>
                                <Col>
                                    <Typography.Text>
                                        |
                                    </Typography.Text>
                                </Col>
                                <Col>
                                    <Typography.Text>
                                        Đã bán  : <strong>{product?.pr_sold}</strong>
                                    </Typography.Text>
                                </Col>
                            </Flex>
                            <Flex justify="flex-start" align='flex-start' gap={20} >
                                <Typography.Text>
                                    Đánh giá :
                                </Typography.Text>
                                <Rate
                                    disabled
                                    allowHalf
                                    value={parseFloat(product?.pr_rating)}
                                >
                                </Rate>
                            </Flex>
                            {/* Giá */}
                            <Flex justify="flex-start" align='center' gap={100}>
                                <Col>
                                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Giá: </span>
                                </Col>
                                <Col>

                                    <Row style={{ alignItems: 'center' }}>
                                        {product?.pr_sale === 0 ? (
                                            <span style={{ fontSize: '21px', color: 'orangered', fontWeight: 'bold' }}>
                                                {salePrice + ",000đ"}
                                            </span>
                                        ) : (
                                            <>
                                                <span style={{ fontSize: '21px', color: 'orangered', fontWeight: 'bold' }}>
                                                    {salePrice + ",000đ"}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: '25px',
                                                        textDecoration: 'line-through',
                                                        marginLeft: '20px'
                                                    }}>
                                                    {product?.pr_price + ",000đ"}
                                                </span>
                                                <div style={{ marginLeft: '15px' }}>
                                                    <Tag style={{ height: '45%' }} color="#cd201f"> {"-" + product?.pr_sale + "%"}</Tag>
                                                </div>
                                            </>
                                        )}
                                    </Row>
                                </Col>
                            </Flex>
                            {/* Màu sắc */}
                            <Flex justify="flex-start" align='center' gap={60}>
                                <Col>
                                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Màu sắc: </span>
                                </Col>
                                <Col>
                                    {/* {product?.pr_color.map((tag) => ( */}
                                    {productColor.map((tag) => (
                                        <Tag.CheckableTag
                                            key={tag}
                                            checked={selectedColorTag === tag}
                                            onChange={(checked) => handleColorChange(tag, checked)}
                                        >
                                            {tag}
                                        </Tag.CheckableTag>
                                    ))}
                                </Col>
                            </Flex>
                            {/* Kích thước */}
                            <Flex justify="flex-start" align='center' gap={45}>
                                <Col>
                                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Kích thước: </span>
                                </Col>
                                <Col>
                                    {sizeData.map((tag) => (
                                        <Tag.CheckableTag
                                            key={tag}
                                            checked={selectedSizeTag === tag}
                                            onChange={(checked) => handleSizeChange(tag, checked)}
                                        >
                                            {tag}
                                        </Tag.CheckableTag>
                                    ))}
                                </Col>
                            </Flex>
                            {/* Thêm/Bớt số lượng */}
                            <Flex justify="flex-start" align='center' gap={60}>
                                <Col>
                                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Số lượng: </span>
                                </Col>
                                <Col>
                                    <Row style={{ alignItems: 'center' }}>
                                        <Button
                                            onClick={decline}
                                            type="primary"
                                            shape="circle"
                                            icon={<MinusOutlined />}
                                        />
                                        <span
                                            style={{
                                                fontSize: '25px',
                                                marginLeft: '20px'
                                            }}>
                                            {count}
                                        </span>
                                        <Button
                                            onClick={increase}
                                            style={{
                                                marginLeft: '20px'
                                            }}
                                            type="primary"
                                            shape="circle"
                                            icon={<PlusOutlined />} />
                                    </Row>
                                </Col>
                            </Flex>
                            {/* Nút thêm/mua hàng */}
                            <Flex
                                style={{
                                    marginTop: '20px'
                                }}
                                justify="flex-start"
                                align='center'
                                gap={60}
                            >
                                <Col>
                                    <button
                                        onClick={async () => {
                                            if (uid === null) {
                                                setIsLogin(true)
                                            } else {
                                                const newProduct = {
                                                    "size": selectedSizeTag,
                                                    "id": productID1,
                                                    "color": selectedColorTag,
                                                    "quantity": count
                                                }
                                                const result = await addItemToCart(uid, newProduct)
                                                if (result === true) {
                                                    message.success(`Thêm sản phẩm ${product?.pr_name} vào giỏ hàng thành công!`)
                                                }
                                                else {
                                                    message.error(`Thêm sản phẩm ${product?.pr_name} vào giỏ hàng thất bại!`)
                                                }
                                            }

                                        }}
                                        className="btn-addToCard">
                                        THÊM VÀO GIỎ HÀNG
                                    </button>
                                </Col>
                                <Col>
                                    <button
                                        className="btn-buyNow"
                                        onClick={async () => {
                                            const newProduct = {
                                                "size": selectedSizeTag,
                                                "id": productID1,
                                                "color": selectedColorTag,
                                                "quantity": count
                                            }
                                            const result = await addItemToCart(uid, newProduct)
                                            if (result === true) {
                                                navigate("/checkout")
                                            }
                                            else {
                                                message.error(`Mua sản phẩm ${product?.pr_name} vào giỏ hàng thất bại!`)
                                            }
                                        }}
                                    >
                                        MUA NGAY
                                    </button>
                                </Col>
                            </Flex>
                            <Flex
                                style={{
                                    marginTop: '20px'
                                }}
                                justify="flex-start"
                                align='center'
                                gap={60}
                            >
                                {contextHolder}
                                <span
                                    style={{
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                    }}
                                    onClick={openNotification}
                                > Hướng dẫn chọn size </span>
                            </Flex>
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                </Content>
            </Layout>
            <ProductTabs product={product} />
            <span
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginLeft: 10
                }}
            > Sản phẩm liên quan </span>
            <Row>
                <Col span={24}> <ClothesList title={""} products={relatedProducts} /> </Col>
            </Row>
            <Modal
                open={isLogin}
                okText="Đồng ý"
                cancelText="Ở lại"
                title="Bạn phải đăng nhập để thực hiện chức năng này!"
                onCancel={() => {
                    setIsLogin(false);
                }}
                onOk={() => {
                    navigate("/login")
                    setIsLogin(false);
                }}
            ></Modal>
        </Layout>
    )
}

export default DetailsClothes