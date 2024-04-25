import React, { useState } from 'react';
import { Card, message } from "antd";
import { Image } from "antd";
import { Typography } from "antd";
import { Badge } from "antd";
import { Rate } from "antd";
import { List, Modal, Flex, Col, Row, Carousel, Tag, Button, Space } from "antd";
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined, } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { addItemToCart } from '../../../APi';


export default function ClothesList({ title, products }) {
  const navigate = useNavigate();
  const ButtonGroup = Button.Group;
  const handleOnClickCard = (productID) => {
    // console.log("ProductID" + productID);
    navigate(`/products/${productID}`, {
      state: { productID: productID }
    })
  }
  const uid = localStorage.getItem("uid");
  const [isEdditing, setEdditing] = useState(false);
  const [isLogin, setIsLogin] = useState(false)
  const [productInfo, setProductInfo] = useState(null);
  const [salePrice, setSalePrice] = useState(null);
  const [count, setCount] = useState(1);
  const [selectedColorTag, setSelectedColorTag] = React.useState('');
  const [selectedSizeTag, setSelectedSizeTag] = React.useState('');

  const handleOnclickCart = (product) => {
    if (uid === null) {
      setIsLogin(true)
    }
    else {
      setEdditing(true)
      setProductInfo(product)
      const salePrice = parseInt((product.pr_price - (product.pr_price * product.pr_sale) / 100))
      setSalePrice(salePrice)
      setSelectedColorTag(product.pr_color[0]);
      setSelectedSizeTag(product.pr_sizes[0])
    }
  }

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
    } else {
      setSelectedSizeTag('');
    }
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
  return (
    <div
      style={{
        marginLeft: 10
      }}
    >
      <h1>
        {title}
      </h1>
      <Space
        size={"large"}
        align='center'
        wrap
      >
        {products?.map((product, index) => (
          <div
            key={index}
            style={{
              width: 300,
              marginTop: 10,
              marginBottom: 30,
              marginLeft: 10
            }}
          >
            <Badge.Ribbon
              text={product.pr_sale === 0 ? "" : product.pr_sale + "%"}
            >
              <Card
                hoverable
                style={{
                  width: 300,
                }}
                cover={
                  <Image
                    height={300}
                    alt="example" src={product.pr_images[1]}
                  />}
                actions={[
                  <Rate
                    disabled
                    allowHalf
                    value={product.pr_rating}
                  >
                  </Rate>,
                  < ShoppingCartOutlined
                    onClick={() => {
                      handleOnclickCart(product)
                    }}
                    style={{
                      fontSize: 25
                    }}
                  />
                ]}
              >
                <Card.Meta
                  title={
                    <Typography onClick={() => handleOnClickCard(product.id)}>
                      <Typography.Title
                        level={4}
                        ellipsis
                      >
                        {product.pr_name}
                      </Typography.Title>
                      <Typography.Paragraph>
                        Giá: {parseInt(
                          (product.pr_price - (product.pr_price * product.pr_sale) / 100)
                        ) + ",000đ"}
                        <Typography.Text
                          style={{
                            marginLeft: 4,
                            fontSize: 18
                          }}
                          delete
                          type='danger'
                        >
                          {
                            product.pr_sale !== 0 ? product.pr_price + ",000đ" : ""
                          }
                        </Typography.Text>
                      </Typography.Paragraph>
                    </Typography>
                  }
                />
              </Card>
            </Badge.Ribbon>
          </div>
        ))}
      </Space>
      <Modal
        open={isEdditing}
        okText="Thêm vào giỏ hàng"
        cancelText="Hủy"
        width={800}
        onCancel={() => {
          setEdditing(false)
        }}
        onOk={async () => {
          const newProduct = {
            "size": selectedSizeTag,
            "id": productInfo.id,
            "color": selectedColorTag,
            "quantity": count
          }
          const result = await addItemToCart(uid, newProduct)
          if (result === true) {
            message.success(`Thêm sản phẩm ${productInfo?.pr_name} vào giỏ hàng thành công!`)
            setEdditing(false)
          }
          else {
            message.error(`Thêm sản phẩm ${productInfo?.pr_name} vào giỏ hàng thất bại!`)
          }
        }}
      >

        <Row >
          <Col span={8} >
            <Carousel
              autoplay
            >
              {
                productInfo?.pr_images.map(image => (
                  <div
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Image
                      src={image}
                      style={{ width: "100%", height: "100%", objectFit: "fill" }}
                    />
                  </div>
                ))}
            </Carousel>
          </Col>
          <Col span={2} style={{ height: 150 }}>
          </Col>
          <Col span={14}>
            <Flex vertical>
              <Row style={{
                marginBottom: 10
              }}>
                <strong style={{ fontSize: 20 }}>{productInfo?.pr_name}</strong>
              </Row>
              {/* Ma san pham */}
              <Row style={{
                marginBottom: 10
              }}>
                <Flex justify="flex-start" align='flex-start' gap={'small'}>
                  <Col>
                    <Typography.Text>
                      Mã sản phẩm : <strong>{productInfo?.id}</strong>
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Typography.Text>
                      |
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Typography.Text>
                      Tình trạng : <strong>{productInfo?.pr_status === true ? 'Còn hàng' : 'Hết hàng'}</strong>
                    </Typography.Text>
                  </Col>
                </Flex>
              </Row>
              {/* Gia */}
              <Row style={{
                marginBottom: 10
              }}>
                <Flex justify="flex-start" align='center' gap={100}>
                  <Col>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Giá: </span>
                  </Col>
                  <Col>
                    <Row style={{ alignItems: 'center' }}>
                      <span style={{ fontSize: '21px', color: 'orangered', fontWeight: 'bold' }}>
                        {salePrice + ",000đ"}
                      </span>
                      <span
                        style={{
                          fontSize: '25px',
                          textDecoration: 'line-through',
                          marginLeft: '20px'
                        }}>
                        {productInfo?.pr_price + ",000đ"}
                      </span>
                      <div style={{ marginLeft: '15px' }}>
                        <Tag style={{ height: '45%' }} color="#cd201f"> {"-" + productInfo?.pr_sale + "%"}</Tag>
                      </div>
                    </Row>
                  </Col>
                </Flex>
              </Row>
              {/* Mau sac */}
              <Row style={{
                marginBottom: 10
              }}>
                <Flex justify="flex-start" align='center' gap={60}>
                  <Col>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Màu sắc: </span>
                  </Col>
                  <Col>
                    {productInfo?.pr_color.map((tag, index) => (
                      <Tag.CheckableTag
                        key={index}
                        checked={selectedColorTag === tag}
                        onChange={(checked) => handleColorChange(tag, checked)}
                      >
                        {tag}
                      </Tag.CheckableTag>
                    ))}
                  </Col>
                </Flex>
                {/* Size */}
              </Row>
              <Row style={{
                marginBottom: 10
              }}>
                <Flex justify="flex-start" align='center' gap={60}>
                  <Col>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Kích thước: </span>
                  </Col>
                  <Col>
                    {productInfo?.pr_sizes.map((tag) => (
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
              </Row>
              {/* So luong */}
              <Row style={{
                marginBottom: 10
              }}>
                <Flex justify="flex-start" align='center' gap={60}>
                  <Col>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Số lượng: </span>
                  </Col>
                  <Col>
                    <ButtonGroup>
                      <Button
                        onClick={decline}
                        icon={<MinusOutlined />}
                      />
                      <Button
                        disabled
                        style={{
                          fontWeight: 'bold',
                          color: 'orange'
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
                </Flex>
              </Row>
              <Row style={{
                marginBottom: 10
              }}>
              </Row>
            </Flex>
          </Col>
        </Row>
      </Modal>
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
    </div>
  );
}