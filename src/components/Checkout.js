import React, { useEffect, useState } from 'react'
import { Input, Card, Button, Image, Flex, Row, Col, Form, message, Radio, Divider, Badge } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { addPurchaseHistoryUsers, getCartItemByUID, getProductByID, increaseSoldCountOfProduct } from '../APi';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../Services/firebase';

function CheckoutPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [value, setValue] = useState(1);
    const [showBankInfo, setShowBankInfo] = useState(false);
    const uid = localStorage.getItem("uid");
    const [userCart, setUserCart] = useState([]);
    const [cartFullData, setCartFullData] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const getCartData = async () => {
        if (uid !== null) {
            try {
                const cartData = await getCartItemByUID(uid)
                setUserCart(cartData.items)
            } catch (error) {
                console.log("Error et CartData: ", error);
            }
        }
        else {
            navigate("/login")
        }
    }

    const fetchProductDataForCartItems = async () => {
        // console.log("Goi ham featchProduct");
        const updatedCartData = [];
        for (const item of userCart) {
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

    useEffect(() => {
        getCartData();
    }, [uid])

    useEffect(() => {
        if (userCart.length > 0) {
            fetchProductDataForCartItems();
        }
    }, [userCart]);


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImageUrl(reader.result)
            }
            try {
                const imageRef = ref(storage, `bills/${file.name + uuidv4()}`)
                const uploadImage = uploadBytesResumable(imageRef, file);
                await uploadImage;
                const imageUrl = await getDownloadURL(uploadImage.snapshot.ref);
                // if (imageUrl) {
                //     setUserData({
                //         ...userData, image: imageUrl
                //     })
                //     await updateProfileImage(userData.uid, imageUrl)
                // }
                // else {
                //     console.error('Error: downloadURL is undefined');
                // }
            } catch (error) {
                console.error('Error uploading image to storage:', error);
            }
            reader.readAsDataURL(file);
        }
    }

    console.log("CartFullData: ", cartFullData);
    const onChange = (e) => {
        setValue(e.target.value);
        if (e.target.value == 2) {
            setShowBankInfo(true);
        }
        else {
            setShowBankInfo(false);
        }
    };
    const showBankInfomation = () => {
        return (
            <Flex gap={20}>
                <Card
                    hoverable
                    style={{
                        width: 240,
                        marginLeft: 30
                    }}
                    cover={<img alt="example" src="https://firebasestorage.googleapis.com/v0/b/tunzclothesbackup.appspot.com/o/bankinfo.jpg?alt=media&token=2f06287b-ccdc-4c74-a4be-2d7b1a28088c" />}
                >
                    <Card.Meta title="STK: 30556789999" description="Ngân hàng: MBBank" />
                </Card>
                <Col>
                    <Input
                        style={{
                            height: 50,
                            marginBottom: 20
                        }}
                        onChange={handleImageChange}
                        type={"file"}
                    ></Input>
                    <Image src={imageUrl} width={300} height={400}></Image>
                </Col>
            </Flex>
        )
    }
    let totalPrice = 0;
    for (const item of cartFullData) {
        let salePrice = (parseInt((item.productData.pr_price - (item.productData.pr_price * item.productData.pr_sale) / 100)) * item.quantity)
        totalPrice = totalPrice + salePrice
    }
    // Status = false đang chờ duyệt, status = strue là đã được duyệt
    const onFinish = async (values) => {
        let status = true
        if (values.payment === 1) {
            if (totalPrice >= 1000) {
                status = false
            }
            else {
                status = true
            }
        }

        // if (status == true) {
        //     for (var value of values) {
        //         console.log("ID sản phẩm: " + value.id);
        //     }
        // }

        const uid = localStorage.getItem('uid');
        const bill = {
            ...values,
            "items": cartFullData.map(item => ({
                "id": item.id,
                "name": `${item.productData.pr_name} - ${item.color} - ${item.size} - SL: ${item.quantity}`,
                "image": item.productData.pr_images[0]
            })),
            "status": status,
            "billPrice": totalPrice,
            "rate": false,
        };

        if (status === true) {
            for (var item of bill.items) {
                await increaseSoldCountOfProduct(item.id)
            }
        }

        const result = await addPurchaseHistoryUsers(uid, bill);
        if (result === true && status === true) {
            message.success("Đơn hàng đang được giao đến bạn!")
            navigate("/user/history-purchase")
            handleCancel();
        }
        else if (result === true && status === false) {
            message.info("Đơn hàng của bạn đang được duyệt")
        }
        else {
            message.error("Đơn hàng được mua không thành công")
        }
        console.log("Bill: ", bill)
        // console.log("UID: ", uid)
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Hãy điền đầy đủ các trường')
    };
    const handleCancel = () => {
        form.resetFields();
        message.info('Hủy thành công')
    };



    return (
        <>
            <Row>
                <Col span={10} style={{ padding: 10, marginLeft: 30 }}>
                    <Row>
                        <a to=''><Image
                            preview={false}
                            src="https://firebasestorage.googleapis.com/v0/b/tunztunzzclothing.appspot.com/o/logo-Photoroom.png-Photoroom.png?alt=media&token=41f23438-d0f9-4b0d-9286-704bf35a9e63">
                        </Image></a>
                    </Row>
                    <strong> Thông tin giao hàng</strong>
                    <Form
                        form={form}
                        layout='vertical'
                        size='large'
                        initialValues={{ payment: value }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Row>
                            <Col
                                span={18}
                            >
                                <Form.Item
                                    label="Họ và tên: "
                                    name="name"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                span={10}
                            >
                                <Form.Item
                                    label="Email: : "
                                    name="email"
                                >
                                    <Input type='email' />
                                </Form.Item>
                            </Col>
                            <Col
                                span={2}
                            ></Col>
                            <Col
                                span={6}
                            >
                                <Form.Item
                                    label="Số điện thoại: "
                                    name="tel"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại'
                                        }
                                    ]}
                                >
                                    <Input type='number' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                span={18}
                            >
                                <Form.Item
                                    label="Địa chỉ: "
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập địa chỉ'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Item
                                label="Phương thức thanh toán"
                                name="payment"
                                required
                            >
                                <Radio.Group
                                    onChange={onChange}
                                >
                                    <Radio value={1}>Thanh toán khi nhận hàng</Radio>
                                    <Radio value={2}>Chuyển khoản</Radio>`
                                </Radio.Group>
                            </Form.Item>
                        </Row>
                        {showBankInfo && <Row style={
                            {
                                marginBottom: 20
                            }
                        }>{showBankInfomation()}</Row>}
                        <Row>
                            <Col span={18}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Xác nhận đơn hàng
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={3}></Col>
                <Col span={10} style={{ padding: 10, marginRight: 30 }}>
                    <Row>
                        <h1>Danh sách sản phẩm</h1>
                    </Row>
                    <Flex vertical>
                        <InfiniteScroll
                            height={400}
                            dataLength={cartFullData.length}
                        >
                            {cartFullData?.map((item, index) => (
                                <Card key={index} style={{ width: 470, padding: 8, marginBottom: 10 }}>
                                    <Card.Meta
                                        style={{ height: 120 }}
                                        avatar={
                                            <Badge
                                                shape="square"
                                                count={item.quantity}>
                                                <Image
                                                    preview={false}
                                                    width={100}
                                                    height={'100%'}
                                                    src={item.productData.pr_images[0]}
                                                    style={{ objectFit: 'fill' }}
                                                />
                                            </Badge>
                                        }
                                        title={<strong>{item.productData.pr_name}</strong>}
                                        description={<CardDescription
                                            product={item}
                                        />}
                                    />
                                </Card>
                            ))}
                        </InfiniteScroll>
                        <Divider />
                        <Row>
                            <Col span={8}>
                                <h3>Tổng cộng: </h3>
                            </Col>
                            <Col span={6}></Col>
                            <Col span={10}>
                                <h2 style={{
                                    fontWeight: 500,
                                    color: "blue"
                                }}> {(totalPrice || '0')?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ",000đ"}</h2>
                            </Col>
                        </Row>
                    </Flex>
                </Col>
            </Row>
        </>
    )
}


function CardDescription({ product }) {
    const salePrice = parseInt((product?.productData.pr_price - (product?.productData.pr_price * product?.productData.pr_sale) / 100))
    return (
        <Flex vertical={'vertical'} gap={10}>
            <Row gutter={[16, 16]}>
                <Col span={12} style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {product?.color} / {product?.size}
                </Col>
                <Col span={2} ></Col>
                <Col span={4} ></Col>
                <Col span={6} ></Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={10}>
                    {"Số lượng: " + product?.quantity}
                </Col>

                <Col span={2} ></Col>
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
                                }}>{((salePrice * product.quantity) || '0')?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ",000đ"}</span>
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

export default CheckoutPage