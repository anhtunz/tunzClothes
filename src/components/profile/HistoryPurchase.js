import React, { useEffect, useState } from 'react'
import { Col, Row, Flex, Card, Button, Rate, message, Image, Divider, Modal } from 'antd';
import { addCommentbyProductID, getProductByID, getPurchaseHistory, updateBillWithPurchaseHistory, updateProductbyUser } from '../../APi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// ??????
const Rating = {
    'rate': "",
    'comment': ""
}

function HistoryPurchasePage() {
    const uid = localStorage.getItem('uid');
    const [historyPurchase, setHistoryPurchase] = useState(null)
    const [items, setItems] = useState(null)

    const [item, setItem] = useState(null);
    const [isEdditing, setEdditing] = useState(false);

    const [value, setValue] = useState(0);
    const [userRate, setUserRate] = useState(Rating)
    const desc = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'];

    // ?????????
    const [descriptionText, setDescriptionText] = useState('')
    const handleDescriptionChange = (event, editor) => {
        const data = editor.getData();
        setDescriptionText(data)
    };

    const [selectedProductId, setSelectedProductId] = useState(null);

    const fetchHistoryPurchase = async (uid) => {
        try {
            const purchaseItemData = await getPurchaseHistory(uid);
            setHistoryPurchase(purchaseItemData);

            if (purchaseItemData && purchaseItemData.purchase_history) {
                setItems(purchaseItemData.purchase_history);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart item:', error);
        }
    };

    const onRatingProduct = (productId, historyItem) => {
        setSelectedProductId(productId);
        setItem(historyItem);
        setEdditing(true)
    }

    useEffect(() => {
        if (uid !== "") {
            try {
                fetchHistoryPurchase(uid);
            } catch (error) {
                console.error('Error fetching cart item:', error);
            }
        }
    }, [uid]);



    console.log("Items", historyPurchase);
    return (
        <Flex justify="space-between" vertical gap={10} style={{ width: '100%', padding: 20 }}>
            <strong style={{ textAlign: 'center', fontSize: '20px' }}>Lịch sử mua hàng</strong>
            <InfiniteScroll
                dataLength={5}
                height={700}
            >
                {
                    items?.filter(item => item.status === true).map((item, index) => (
                        <Flex key={index} gap={15} vertical>
                            <Row style={{ marginBottom: 10 }}>
                                <strong style={{ textDecoration: 'underline', fontSize: 20 }}>Đơn hàng {index + 1}</strong>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <strong>Người mua: </strong> {item.name}
                                </Col>
                                <Col span={6}>
                                </Col>
                                <Col span={8}>
                                    <strong>Điện thoại: </strong> {item.tel}
                                </Col>
                            </Row>
                            <Row>
                                <strong>Địa chỉ: </strong> {item.address}
                            </Row>
                            <Row>
                                <Card
                                    title={<strong style={{ textAlign: 'center' }}>Danh sách đơn hàng</strong>}
                                    style={{ width: '100%' }}
                                    actions={[
                                        <p style={{ fontSize: '20px' }}>
                                            <strong style={{ color: 'red' }}>Tổng tiền: </strong> {(item.billPrice || '0')?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ",000đ"}
                                        </p>,
                                        item.rate === false ?
                                            <Button
                                                type="primary"
                                                shape="round"
                                                style={{ marginTop: '10px' }}
                                                onClick={() => onRatingProduct(item.items, item)}
                                            >Đánh giá</Button>
                                            :
                                            <Button type="text" disabled style={{ marginTop: '24px' }}>Đã đánh giá</Button>
                                    ]}
                                >
                                    {
                                        item?.items.map((bill, index) => (
                                            <Card.Meta
                                                key={index}
                                                style={{
                                                    width: '100%',
                                                    marginBottom: 10
                                                }}
                                                avatar={<Image height={50} width={50} src={bill?.image} />}
                                                title={bill?.name}
                                            />
                                        ))
                                    }
                                </Card>
                            </Row>
                            <Divider />
                        </Flex>
                    ))
                }
            </InfiniteScroll>
            <Modal
                title={<strong style={{ textAlign: 'center', fontSize: '16px' }}>Đánh giá sản phẩm</strong>}
                open={isEdditing}
                okText="Xong"
                cancelText="Hủy"
                onCancel={() => {
                    setEdditing(false)
                }}
                onOk={async () => {
                    // console.log("Rate: ", value);
                    // console.log("Comment: ", descriptionText);
                    // console.log("ID của người dùng:", uid);
                    // console.log("Item Click: ", item);
                    // console.log("ID bảng bill: ", historyPurchase.purchase_history);
                    historyPurchase.purchase_history.forEach(purchase => {
                        if (purchase.address === item.address &&
                            purchase.rate === item.rate &&
                            purchase.status === item.status
                        ) {
                            purchase.rate = true;
                        }
                    });
                    console.log("HistoryPurchase sau thay đổi: ", historyPurchase);
                    for (var product of selectedProductId) {
                        // console.log("ID của sản phẩm:", product.id);
                        const productDetail = await getProductByID(product.id);
                        const productSold = productDetail.pr_sold + 1;
                        const productRate = (parseFloat(productDetail.pr_rating) * productDetail.pr_sold + value) / (productSold);
                        productDetail.pr_sold = productSold;
                        productDetail.pr_rating = productRate.toString();
                        console.log("PrSold thay đổi: ", productSold);
                        console.log("PrRate thay đổi: ", productRate);
                        console.log("productDetail sau khi cập nhật:", productDetail);
                        const productUpdateResult = await updateProductbyUser(productDetail);
                        const commentUpdateResult = await addCommentbyProductID(product.id, uid, value, descriptionText)
                        if (productUpdateResult === true && commentUpdateResult === true) {
                            message.success('Cảm ơn bạn đã đánh giá, hãy tiếp tục mua sắm!')
                        }
                        else {
                            message.error('Đánh giá sản phẩm bị lỗi!')
                        }
                    }
                    await updateBillWithPurchaseHistory(uid, historyPurchase)
                    fetchHistoryPurchase()
                    setEdditing(false);
                }}
            >
                <Row style={{
                    padding: 10
                }}>
                    <Col>
                        <strong>Chất lượng: </strong>
                        <Rate tooltips={desc} onChange={setValue} value={value} style={{ marginLeft: 20 }} />
                    </Col>
                </Row>
                <Row style={{
                    padding: 10
                }}
                >
                    <Col>
                        <strong>Viết đánh giá: </strong>
                    </Col>
                    <Col>
                        <CKEditor

                            editor={ClassicEditor}
                            data="Viết một số đánh giá của bạn..."
                            onChange={handleDescriptionChange}
                        />
                    </Col>
                </Row>
            </Modal>
        </Flex>
    )
}

export default HistoryPurchasePage