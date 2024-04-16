import React, { useEffect, useRef, useState } from 'react'
import { Flex, Col, Row, Form, Input, Select, Button, message, Tag, Tooltip, theme, Menu, Image } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { createNewProduct, getAllCatergory, getAllChildCategory } from '../APi';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../Services/firebase';

const product = {
    category_detail: "",
    pr_color: [],
    pr_description: "",
    pr_images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9zTWGN8csBx7fjTUl6pitrk1qS-JTxAydERcusMa22g&s",
    ],
    pr_name: "",
    pr_price: 0,
    pr_rating: "0",
    pr_sale: 0,
    pr_sold: 0,
    pr_status: true,
    pr_sizes: []
}

const tagInputStyle = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: 'top',
};


function AddProductPage() {
    const [form] = Form.useForm();
    const [productImages, setProductImages] = useState([])
    // Khai báo list hình ảnh
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            try {
                const imageRef = ref(storage, `products/${file.name + uuidv4()}`)
                const uploadImage = uploadBytesResumable(imageRef, file);
                await uploadImage;
                const imageUrl = await getDownloadURL(uploadImage.snapshot.ref);
                if (imageUrl) {
                    setProductImages((pre) => [...pre, imageUrl])
                }
                else {
                    console.error('Error: downloadURL is undefined');
                }
            } catch (error) {
                console.error('Error uploading image to storage:', error);
            }
            reader.readAsDataURL(file);
        }
    }
    // Khai báo tag màu sắc
    const [colortags, setColorTags] = useState(['Đen']);
    const { token } = theme.useToken();
    const [editColorInputIndex, setEditColorInputIndex] = useState(-1);
    const [editColorInputValue, setEditColorInputValue] = useState('');
    const [inputColorValue, setInputColorValue] = useState('');
    const [inputColorVisible, setInputColorVisible] = useState(false);
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    const handleInputColorChange = (e) => {
        setInputColorValue(e.target.value);
    };
    const handleEditInputColorChange = (e) => {
        setEditColorInputValue(e.target.value);
    };
    const handleEditInputColorConfirm = () => {
        const newTags = [...colortags];
        newTags[editColorInputIndex] = editColorInputValue;
        setColorTags(newTags);
        setEditColorInputIndex(-1);
        setEditColorInputValue('');
    };
    const handleColorClose = (removedTag) => {
        const newTags = colortags.filter((tag) => tag !== removedTag);
        console.log(newTags);
        setColorTags(newTags);
    };
    const handleColorInputConfirm = () => {
        if (inputColorValue && !colortags.includes(inputColorValue)) {
            setColorTags([...colortags, inputColorValue]);
        }
        setInputColorVisible(false);
        setInputColorValue('');
    };
    const tagColorPlusStyle = {
        height: 22,
        background: token.grey,
        borderStyle: 'dashed',
    };
    const showColorInput = () => {
        setInputColorVisible(true);
    };

    //  Khai báo size
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
        value.forEach(item => {
            product.pr_sizes.push(item);
        });
    };

    // Khai báo thể loại
    const [category, setCategory] = useState([])
    const [categoryDetail, setCategoryDetail] = useState([])
    const [categoryDetailName, setCategoryDetailName] = useState("")
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
    const renderMenuItems = () => {
        return category.map(cat => (
            <Menu.SubMenu key={cat.id} title={cat.category_name} icon={<MinusOutlined />}>
                {categoryDetail.find(detail => detail.categoryId === cat.id)?.details.map(detail => (
                    <Menu.Item key={detail.id} data-label={detail.detail_name}>{detail.detail_name}</Menu.Item>
                ))}
            </Menu.SubMenu>
        ));
    };

    const onMenuClick = (e) => {
        const label = e.item.props['data-label'];
        product.category_detail = e.key;
        setCategoryDetailName(label);
    };

    // Khai báo CKEditor trong TextArea
    const [descriptionText, setDescriptionText] = useState('')
    const handleDescriptionChange = (event, editor) => {
        const data = editor.getData();
        setDescriptionText(data)
    };
    // Khai báo tình trạng
    const handleStatusChange = (value) => {
        product.pr_status = value
    };

    // Lấy giá trị từ form
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Hãy điền đầy đủ các trường')
    };
    const handleCancel = () => {
        form.resetFields();
        setCategoryDetailName('')
        message.info('Hủy thành công')
    };
    const onFinish = async (values) => {
        product.category_detail = categoryDetailName;
        product.pr_name = values.pr_name;
        product.pr_description = descriptionText;
        product.pr_color = colortags;
        product.pr_price = parseInt(values.pr_price);
        product.pr_sale = parseInt(values.pr_sale);
        product.pr_images = productImages;
        const result = await createNewProduct(product)
        if (result === true) {
            message.success('Thêm sản phẩm thành công')
            handleCancel();
        }
        else {
            message.error('Thêm sản phẩm thất bại')
        }
    };

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
                        fontWeight: 'bold'
                    }}
                >Thêm mới sản phẩm</Col>
            </Row>
            <Form
                form={form}
                layout='vertical'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    pr_sizes: [
                        'S',
                        'M'
                    ],
                    pr_status: true,
                }}
            >
                {/* Hình ảnh sản phẩm */}
                <Row gutter={16}>
                    <Col span={5}>
                        <Form.Item
                            name="pr_images"
                            label="Hình ảnh sản phẩm:"
                        >
                            <Input
                                onChange={handleImageChange}
                                type={"file"}
                            ></Input>
                        </Form.Item>
                    </Col>
                    <Col span={19} >
                        <Col span={19}>
                            {productImages?.map((productImage, index) => (
                                <Image
                                    key={index}
                                    style={{
                                        marginLeft: index !== 0 ? 10 : 0,
                                        marginRight: 10
                                    }}
                                    height={100}
                                    width={100}
                                    src={productImage}
                                />
                            ))}
                        </Col>

                    </Col>
                </Row>
                {/* Tên sản phẩm */}
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name="pr_name"
                            label="Tên sản phẩm:"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên sản phẩm không được để trống'
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                {/* Giá tiền và giảm giá */}
                <Row>
                    <Col span={10}>
                        <Form.Item
                            name="pr_price"
                            label="Giá tiền:"
                            rules={[
                                {
                                    required: true,
                                    message: 'Giá tiền không được để trống'
                                },
                            ]}
                        >
                            <Input type='number' addonAfter=",000đ" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                    </Col>
                    <Col span={10} style={{
                        marginBottom: 10
                    }}>
                        <Form.Item
                            name="pr_sale"
                            label="Giảm giá:"
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy nhập mã giảm giá'
                                },
                            ]}
                        >
                            <Input type='number' addonAfter="%" />
                        </Form.Item>
                    </Col>
                </Row>
                {/* Màu sắc + Kích cỡ */}
                <Row>
                    <Col span={10}>
                        <Form.Item
                            name="pr_colors"
                            label="Màu sắc:"
                        >
                            <Flex gap="4px 0" wrap="wrap">
                                {colortags.map((tag, index) => {
                                    if (editColorInputIndex === index) {
                                        return (
                                            <Input
                                                ref={editInputRef}
                                                key={tag}
                                                size="small"
                                                style={tagInputStyle}
                                                value={editColorInputValue}
                                                onChange={handleEditInputColorChange}
                                                onBlur={handleEditInputColorConfirm}
                                                onPressEnter={handleEditInputColorConfirm}
                                            />
                                        );
                                    }
                                    const isLongTag = tag.length > 20;
                                    const tagElem = (
                                        <Tag
                                            key={tag}
                                            closable={index !== 0}
                                            style={{
                                                userSelect: 'none',
                                            }}
                                            onClose={() => handleColorClose(tag)}
                                        >
                                            <span
                                                onDoubleClick={(e) => {
                                                    if (index !== 0) {
                                                        setEditColorInputIndex(index);
                                                        setEditColorInputValue(tag);
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                            </span>
                                        </Tag>
                                    );
                                    return isLongTag ? (
                                        <Tooltip title={tag} key={tag}>
                                            {tagElem}
                                        </Tooltip>
                                    ) : (
                                        tagElem
                                    );
                                })}
                                {inputColorVisible ? (
                                    <Input
                                        ref={inputRef}
                                        type="text"
                                        size="small"
                                        style={tagInputStyle}
                                        value={inputColorValue}
                                        onChange={handleInputColorChange}
                                        onBlur={handleColorInputConfirm}
                                        onPressEnter={handleColorInputConfirm}
                                    />
                                ) : (
                                    <Tag style={tagColorPlusStyle} icon={<PlusOutlined />} onClick={showColorInput}>
                                        Thêm màu sắc
                                    </Tag>
                                )}
                            </Flex>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            name="pr_sizes"
                            label="Kích cỡ sản phẩm:"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Chọn 1 kích cỡ"
                                // defaultValue={['S', 'M']}
                                onChange={handleSizeChange}
                                style={{
                                    width: '100%',
                                }}
                                options={sizeOptions}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {/* Thể loại + Tình trạng */}
                <Row>
                    <Col span={10}>
                        <Form.Item
                            name="pr_category"
                            label="Thể loại:"
                        >
                            <Input
                                value={categoryDetailName}
                            >
                            </Input>
                            <Menu
                                onClick={onMenuClick}
                                mode="vertical"
                            >
                                {renderMenuItems()}
                            </Menu>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                    </Col>
                    <Col span={10} style={{
                        marginBottom: 10
                    }}>
                        <Form.Item
                            name="pr_status"
                            label="Tình trạng:"
                        >
                            <Select
                                // defaultValue={true}
                                style={{
                                    width: 150,
                                }}
                                onChange={handleStatusChange}
                                options={[
                                    {
                                        value: true,
                                        label: 'Còn hàng',
                                    },
                                    {
                                        value: false,
                                        label: 'Hết hàng',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {/* Mô tả */}
                <Row>
                    <Col
                        span={24}
                    >
                        <Form.Item
                            name="description"
                            label="Mô tả: "
                        >
                            <CKEditor
                                editor={ClassicEditor}
                                data="Bạn hãy ziếc cài gì đấy điiii"
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    // console.log('Editor is ready to use!', editor);
                                }}
                                onChange={handleDescriptionChange}
                                onBlur={(event, editor) => {
                                    // console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    // console.log('Focus.', editor);
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={8}
                    >
                    </Col>
                    <Col
                        span={8}
                    >
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Thêm Sản phẩm
                            </Button>
                            <Button
                                type="text"
                                danger
                                style={{
                                    marginLeft: 10
                                }}
                                onClick={handleCancel}
                            >
                                Hủy
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col
                        span={8}
                    >
                    </Col>
                </Row>
            </Form>
        </Flex>
    )
}



export default AddProductPage