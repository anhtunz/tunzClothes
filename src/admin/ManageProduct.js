import React, { useEffect, useRef, useState } from 'react'
import { Flex, Col, Row, Table, Image, Tag, Button, message, Modal, Input, Select, Rate, theme, Avatar } from 'antd'
import {
    EditOutlined, DeleteOutlined, PlusOutlined
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../Services/firebase';
import { deleteProductByID, getAllProducts, updateProductByAdmin } from '../APi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


function ManageProductPage() {
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState([])
    const [isEdditing, setEdditing] = useState(false);
    let [editProduct, setEditProduct] = useState(null);
    const [imagesUrl, setImagesUrl] = useState([]);
    // Tag màu sắc
    const [productColors, setProductColors] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const { token } = theme.useToken();
    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);
    const tagColorsInputStyle = {
        background: token.colorBgContainer,
        borderStyle: 'dashed',
        height: 25
    };
    const handleClose = (removedTag) => {
        const newTags = productColors.filter((tag) => tag !== removedTag);
        // console.log(newTags);
        setProductColors(newTags);
    };
    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue && productColors.indexOf(inputValue) === -1) {
            setProductColors(prevColors => [...prevColors, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };
    // Select size
    const [productSize, setProductSize] = useState([]);
    const sizeOptions = [
        {
            value: "S",
            label: "Size S",
        },
        {
            value: "M",
            label: "Size M",
        },
        {
            value: "L",
            label: "Size L",
        },
        {
            value: "XL",
            label: "Size XL",
        },
        {
            value: "XXL",
            label: "Size XXL",
        },
    ];
    const handleSizeChange = (value) => {
        console.log("Value: ", value);
        setProductSize([])
        value.forEach(item => {
            productSize.push(item);
        });
        setEditProduct({
            ...editProduct,
            pr_sizes: value
        })
        console.log("Product Size Change: ", productSize);
    };
    // Tình trạng
    const [prStatus, setPrStatus] = useState(true)
    const handleStatusChange = (value) => {
        setPrStatus(value)
    };
    // Mo tả
    const [descriptionText, setDescriptionText] = useState('')
    const handleDescriptionChange = (event, editor) => {
        const data = editor.getData();
        setDescriptionText(data)
        // console.log("Description: ", descriptionText);
    };


    useEffect(() => {
        setLoading(true);
        fetchproductData();
    }, [])
    const fetchproductData = async () => {
        const products = await getAllProducts();
        if (products) {
            setProductData(products)
            setLoading(false)
        }
        else {
            setProductData([]);
        }
    }

    const DescriptionColumn = ({ description }) => {
        const shortenDescription = (description, maxLength) => {
            if (description.length > maxLength) {
                return description.slice(0, maxLength) + '...';
            }
            return description;
        };

        return <div>{shortenDescription(description, 50)}</div>;
    };

    const columns = [
        {
            key: "1",
            title: "ID",
            dataIndex: 'id',
        },
        {
            key: "2",
            title: "Tên sản phẩm",
            dataIndex: "pr_name",
        },
        {
            key: "3",
            title: "Ảnh",
            dataIndex: "pr_images",
            render: images => (
                <InfiniteScroll
                    height={100}
                    dataLength={images.length}
                >
                    {images?.map(image => (
                        <Image src={image} alt="Product Image" height={100} width={100} />
                    ))}
                </InfiniteScroll>
            )
        },
        {
            key: "4",
            title: "Màu sắc",
            dataIndex: "pr_color",
            render: colors => (
                <Row span={2}>
                    {colors?.map(colors => (
                        <Tag color='#2db7f5' key={colors}>{colors}</Tag>
                    ))}
                </Row>
            )
        },
        {
            key: "5",
            title: "Kích thước",
            dataIndex: "pr_sizes",
            render: sizes => (
                <Row span={2}>
                    {sizes?.map((size, index) => (
                        <Tag key={index} color="gold">{size}</Tag>
                    ))}
                </Row>
            )
        },
        {
            key: "6",
            title: "Giá",
            dataIndex: "pr_price",
            render: prices => <span>{prices + ",000đ"}</span>
        },
        {
            key: "7",
            title: "Giảm giá",
            dataIndex: "pr_sale",
            render: sale => <Tag color="red">{sale + "%"}</Tag>
        },
        {
            key: "8",
            title: "Lượt bán",
            dataIndex: "pr_sold",
        },
        {
            key: "9",
            title: "Đánh giá",
            dataIndex: "pr_rating",
            render: rating => <Rate allowHalf defaultValue={rating} />

        },
        {
            key: "10",
            title: "Thể loại",
            dataIndex: "category_detail",
        },
        {
            key: "11",
            title: "Mô tả",
            dataIndex: "pr_description",
            render: description => <DescriptionColumn description={description} />
        },
        {
            key: "12",
            title: "Tình Trạng",
            dataIndex: "pr_status",
            render: status => status ? <Tag color="#87d068">Đang bán</Tag> : <Tag color="#f50">Chưa bán</Tag>
        },

        {
            key: "13",
            title: "Thao tác",
            fixed: 'right',
            with: 300,
            render: (record) => {
                return (
                    <>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<EditOutlined />}
                            onClick={() => {
                                onEditProduct(record)
                            }}
                        >
                            Sửa
                        </Button>
                        <Button
                            type="primary"
                            danger
                            shape="round"
                            icon={<DeleteOutlined />}
                            style={{
                                marginLeft: 10
                            }}
                            onClick={() => {
                                onDeleteProduct(record);
                            }}
                        >
                            Xóa
                        </Button>
                    </>
                );
            },
        },
    ];


    const onDeleteProduct = (record) => {
        Modal.confirm({
            title: `Bạn có chắc chắn muốn xóa sản phẩm "${record.pr_name}" này?`,
            onOk: async () => {
                const result = await deleteProductByID(record.id);
                if (result === true) {
                    fetchproductData();
                    message.success("Xóa sản phẩm thành công")
                }
                else {
                    message.error("Xóa sản phẩm thất bại")
                }

            }
        })
    }

    const onEditProduct = (record) => {
        setEdditing(true)
        setEditProduct({ ...record })
        setImagesUrl(record.pr_images)
        setProductColors(record.pr_color)
        setProductSize(record.pr_sizes)
        setPrStatus(record.pr_status)
    }

    return (
        <Flex
            gap={10}
            vertical
        >
            <Row>
                <Col
                    span={24}
                    style={{
                        textAlign: 'center',
                        fontSize: 24,
                        fontWeight: 'bold',
                        marginBottom: 10
                    }}
                >Danh sách sản phẩm </Col>
            </Row>
            <Table
                scroll={{
                    x: 3000,
                }}
                key={"table"}
                loading={loading}
                columns={columns}
                dataSource={productData}
            ></Table>
            <Modal
                title={`Chỉnh sửa sản phẩm ${editProduct?.pr_name}`}
                open={isEdditing}
                okText="Xác nhận"
                cancelText="Hủy"
                onCancel={() => {
                    setEdditing(false)
                }}
                onOk={async () => {
                    setEdditing(false);
                    const updatedProduct = {
                        ...editProduct,
                        pr_color: productColors,
                        pr_description: descriptionText,
                        pr_status: prStatus
                    };
                    const result = await updateProductByAdmin(updatedProduct);
                    if (result === true) {
                        message.success(`Sửa thông tin sản phẩm ${editProduct.pr_name} thành công`)
                    } else {
                        message.error(`Sửa thông tin sản phẩm ${editProduct.pr_name} thất bại`)
                    }
                }}
                width={800}
            >
                <Flex vertical gap={10}>
                    {/* Hình ảnh sản phẩm */}
                    <Row gutter={16}>
                        <Col span={5}>
                            <strong>Hình ảnh sản phẩm: </strong>
                            <Input
                                // onChange={handleImageChange}
                                type={"file"}
                            ></Input>
                        </Col>
                        <Col span={19} >
                            {imagesUrl?.map((productImage, index) => (
                                <Image
                                    key={index}
                                    style={{
                                        marginLeft: index !== 0 ? 10 : 0,
                                        marginRight: 20
                                    }}
                                    height={100}
                                    width={100}
                                    src={productImage}
                                />
                            ))}

                        </Col>
                    </Row>
                    {/* tên sản phẩm */}
                    <Row>
                        <Col span={24}>
                            <strong>
                                Tên sản phẩm:
                            </strong>
                            <Input
                                value={editProduct?.pr_name}
                                onChange={(e) => {
                                    setEditProduct(pre => {
                                        return { ...pre, pr_name: e.target.value }
                                    }
                                    )
                                }}
                            />

                        </Col>
                    </Row>
                    {/* Màu sản phẩm */}
                    <Row>
                        <Col span={24}>
                            <strong>
                                Màu sắc:
                            </strong>
                        </Col>
                        {productColors?.map(col => (
                            <span
                                key={col}
                                style={{
                                    display: 'inline-block',
                                    marginRight: '8px', // Thêm margin để tách các Tag ra xa nhau
                                    marginBottom: '8px' // Thêm margin để tách các Tag ra xa nhau
                                }}
                            >
                                <Tag
                                    closable
                                    onClose={(e) => {
                                        e.preventDefault();
                                        handleClose(col);
                                    }}
                                >
                                    {col}
                                </Tag>
                            </span>
                        ))}
                        {inputVisible ? (
                            <Input
                                ref={inputRef}
                                type="text"
                                size="small"
                                style={{
                                    width: 78,
                                }}
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputConfirm}
                                onPressEnter={handleInputConfirm}
                            />
                        ) : (
                            <Tag
                                onClick={showInput}
                                style={tagColorsInputStyle}
                            >
                                <PlusOutlined /> New Tag
                            </Tag>
                        )}
                    </Row>
                    {/* Kích thước sản phẩm */}
                    <Row>
                        <Flex>
                            <Row>
                                <Col span={24}>
                                    <strong>Kích thước: </strong>
                                </Col>
                                <Col>
                                    <Select
                                        mode="multiple"
                                        placeholder="Chọn 1 kích cỡ"
                                        defaultValue={productSize}
                                        onChange={handleSizeChange}
                                        style={{
                                            width: '100%',
                                        }}
                                        options={sizeOptions}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <strong>Tình trạng: </strong>
                                </Col>
                                <Col>
                                    <Select
                                        defaultValue={prStatus}
                                        style={{
                                            width: 150,
                                        }}
                                        onChange={handleStatusChange}
                                        options={[
                                            {
                                                value: true,
                                                label: 'Đang bán',
                                            },
                                            {
                                                value: false,
                                                label: 'Chưa bán',
                                            },
                                        ]}
                                    />
                                </Col>
                            </Row>
                        </Flex>
                    </Row>
                    {/* Giá và giảm giá */}
                    <Row>
                        <Col span={10}>
                            <strong>Giá sản phẩm:</strong>
                            <Input
                                type='number'
                                addonAfter=",000đ"
                                value={editProduct?.pr_price}
                                onChange={(e) => {
                                    setEditProduct(pre => {
                                        return { ...pre, pr_price: e.target.value }
                                    }
                                    )
                                }}
                            />
                        </Col>
                        <Col span={4}>
                        </Col>
                        <Col span={10} style={{
                            marginBottom: 10
                        }}>
                            <strong>Giảm giá: </strong>
                            <Input
                                type='number'
                                addonAfter="%"
                                value={editProduct?.pr_sale}
                                onChange={(e) => {
                                    setEditProduct(pre => {
                                        return { ...pre, pr_sale: e.target.value }
                                    }
                                    )
                                }}
                            />
                        </Col>
                    </Row>
                    {/* Mô tả */}
                    <Row>
                        <Col>
                            <strong>Mô tả: </strong>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editProduct?.pr_description}
                                onChange={handleDescriptionChange}
                            />
                        </Col>
                    </Row>
                </Flex>
            </Modal>
        </Flex>
    )
}

export default ManageProductPage