import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Button, Col, Flex, Image, Row, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUnprocessedBills, updateBillByAdmin } from '../APi';
import InfiniteScroll from 'react-infinite-scroll-component';


function ManageOrderPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const fetchData = async () => {
    try {
      const data = await getUnprocessedBills();
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'name',
    },

    {
      title: 'Items',
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
      title: 'Tinh trnag',
      dataIndex: 'status',
      key: 'status',
      render: status => status ? 'True' : 'False',
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
              Duyệt
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
                // onDeleteProduct(record);
              }}
            >
              Xóa
            </Button>
          </>
        );
      },
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'purchase_history',
    //   key: 'email',
    //   render: (purchaseHistory) => (
    //     <ul>
    //       {purchaseHistory.map((historyItem, index) => (
    //         <li key={index}>
    //           {historyItem.email}
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
    // {
    //   title: 'Name',
    //   dataIndex: 'purchase_history',
    //   key: 'name',
    //   render: (purchaseHistory) => (
    //     <ul>
    //       {purchaseHistory.map((historyItem, index) => (
    //         <li key={index}>
    //           {historyItem.name}
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
    // {
    //   title: 'Name',
    //   dataIndex: 'purchase_history',
    //   key: 'name',
    //   render: (purchaseHistory) => (
    //     <ul>
    //       {purchaseHistory.map((historyItem, index) => (
    //         <li key={index}>
    //           {historyItem.name}
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
  ];



  const onEditProduct = async (record) => {
    const uid = record.uid
    record.status = true;
    delete record.uid
    console.log("Phan tu uiD click: ", uid);
    console.log("Phan tu click: ", record);
    const result = await updateBillByAdmin(uid, record)
    if (result === true) {
      message.success("Duyệt đơn hàng thành công")
      fetchData();
    }
    else {
      message.error("Duyệt đơn hàng thất bại")
    }
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
          x: 2000,
        }}
        key={"table"}
        loading={loading}
        columns={columns}
        dataSource={items}
      ></Table>
    </Flex>
  )
}

export default ManageOrderPage