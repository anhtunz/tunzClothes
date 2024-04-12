import React from 'react';
import { Card } from "antd";
import { Image } from "antd";
import { Typography } from "antd";
import { Badge } from "antd";
import { Rate } from "antd";
import { List } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

export default function ClothesList({ title, products }) {
  const navigate = useNavigate();

  const handleOnClickCard = (productID) => {
    // console.log("ProductID" + productID);
    navigate(`/products/${productID}`, {
      state: { productID: productID }
    })
  }
  return (
    <div
      style={{
        marginLeft: 10 
      }}
    >
      <h1>
        {title}
      </h1>
      <List
        grid={{
          column: 4   
        }}
        renderItem={(product) => {
          return (
            <div
              style={{
                width: 300,
                marginBottom:20
              }}
            >
              <Badge.Ribbon
                text={product.pr_sale === 0 ? "" : product.pr_sale+ "%"}
              >
                <Card
                  onClick={() => handleOnClickCard(product.id)}
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
                      style={{
                        fontSize: 25
                      }}
                    />
                  ]}
                >
                  <Card.Meta
                    title={
                      <Typography>
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
          )
        }}
        dataSource={products}
      >
      </List>
    </div>
  );
}