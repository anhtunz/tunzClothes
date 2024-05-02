import {
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import { Button, Col, Flex, Image, Row, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { getSuccessfulBills, getUnprocessedBills, updateBillByAdmin } from '../APi';
import InfiniteScroll from 'react-infinite-scroll-component';
import './style.css'

function ManageSuccessfulBillsOrderPage() {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState(null)
    const [detailItem, setDetailItem] = useState(null)
    const fetchData = async () => {
        try {
            const data = await getSuccessfulBills();
            if (data !== null) {
                setItems(data);
                setLoading(false);
                // if (data.length > 0 && items.length > 0) {
                //   setDetailItem(prevDetailItem => [...prevDetailItem, ...data[0].purchase_history]);
                // }
            } else {
                setItems([]);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData()
    }, [])
    console.log("Data: ", items)

    const columns = [
        {
            title: 'UID',
            dataIndex: 'uid',
            key: 'uid',
        },
        {
            title: 'Tên người mua',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'name',
        },

        {
            title: 'Danh sách sản phẩm',
            dataIndex: 'items',
            key: 'items',
            width: 700,
            render: items => (
                <InfiniteScroll
                    dataLength={2}
                    height={100}
                >
                    {items?.map((item, index) => (
                        <Row key={index}>
                            <Image height={100} width={100} src={item.image} alt={item.name} style={{ width: 50, height: 50 }} />
                            <span>{item.name}</span>
                        </Row>
                    ))}
                </InfiniteScroll>
            ),
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: status => status ? 'Đã giao hàng' : 'False',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            key: "billPrice",
            title: "Đơn giá",
            dataIndex: 'billPrice',
            fixed: 'right',
            width: 150,
            render: price => (
                <strong>{(price || '0')?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ",000đ"}</strong>
            )
        },

    ];


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
                >Lịch sử bán hàng </Col>
            </Row>
            <Table
                scroll={{
                    x: 3000,
                }}
                key={"table"}
                loading={loading}
                columns={columns}
                dataSource={items}
            ></Table>
        </Flex>
    )
}

export default ManageSuccessfulBillsOrderPage