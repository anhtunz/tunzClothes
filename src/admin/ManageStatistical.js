import React, { useEffect, useState } from 'react'
import { Button, Col, Flex, Image, Row, Card, Statistic, Tabs } from 'antd';
import { getAllProductsSortedAZ, getAllUsers } from '../APi';
import BarChart from '../components/chart/BarChart';
import PieChart from '../components/chart/PieChart';
function ManageStatisticalPage() {
    const [allUsers, setAllUsers] = useState([])
    const [UsersRole, setUsersRole] = useState()
    const [onlineUsers, setOnlineUsers] = useState([])
    const [offlineUsers, setOfflineUsers] = useState([])
    const [allUsersLoading, setAllUsersLoading] = useState(true)
    const [onlineUsersLoading, setOnlineUsersLoading] = useState(true)
    const [offlineUsersLoading, setOfflineUsersLoading] = useState(true)

    const [allProducts, setAllProducts] = useState([])
    const [allProductsName, setAllProductsName] = useState([])
    const [allProductsSold, setAllProductsSold] = useState([])
    const [allProductsRatingName, setAllProductsRatingName] = useState([])
    const [allProductsRatingCount, setAllProductsRatingCount] = useState([])
    const [activeProducts, setActiveProducts] = useState([])
    const [inActiveProducts, setInActiveProducts] = useState([])
    const [allProductsLoading, setAllProductsLoading] = useState(true)
    const [activeProductsLoading, setActiveProductsLoading] = useState(true)
    const [inActiveProductsLoading, setInActiveProductsLoading] = useState(true)
    const [userCountsData, setUserCountsData] = useState()
    const [userCountsLabels, setUserCountsLabels] = useState()
    const [usersName, setUsersName] = useState([])
    const [userPurcharseCount, setUserPurcharseCount] = useState([])
    const fetchData = async () => {
        const user = await getAllUsers();
        const product = await getAllProductsSortedAZ();
        if (user) {
            setAllUsers(user)
            setAllUsersLoading(false)
        }
        if (product) {
            setAllProducts(product)
            setAllProductsLoading(false)
        }
    }

    const getUsersData = () => {
        const offline = allUsers?.filter(user => user?.status === '0')
        const online = allUsers?.filter(user => user?.status === '1')
        const active = allProducts?.filter(product => product?.pr_status === true)
        const inactive = allProducts?.filter(product => product?.pr_status === false)
        const productsName = allProducts?.map(product => product?.pr_name)
        const productsSold = allProducts?.map(product => product?.pr_sold)
        const productRating = allProducts?.map(product => product?.pr_rating)
        const usersName = allUsers?.map(user => user?.username)
        const usersPurchase = allUsers?.map(user => user?.purchase_ordered)
        const userCounts = {};
        allUsers?.forEach(user => {
            const role = user?.role;
            if (userCounts[role]) {
                userCounts[role]++;
            } else {
                userCounts[role] = 1;
            }
        });
        const userCountsData = Object.values(userCounts);
        const userCountsLabels = Object.keys(userCounts);
        setUsersRole(userCounts)
        setUserCountsData(userCountsData)
        setUserCountsLabels(userCountsLabels)

        setUsersName(usersName)
        setUserPurcharseCount(usersPurchase)

        setAllProductsRatingName(productsName)
        setAllProductsRatingCount(productRating)

        setAllProductsName(productsName)
        setAllProductsSold(productsSold)

        setOfflineUsers(offline)
        setOnlineUsers(online)
        setActiveProducts(active)
        setInActiveProducts(inactive)
        setOnlineUsersLoading(false)
        setOfflineUsersLoading(false)
        setInActiveProductsLoading(false)
        setActiveProductsLoading(false)
    }


    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        getUsersData();
    }, [allUsers])
    console.log("AllUsers: ", allUsers);

    console.log("UserRole: ", UsersRole);

    const data = {
        labels: allProductsName,
        datasets: [{
            label: 'Số lượng bán ra',
            data: allProductsSold,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: {
                type: 'linear', // Sử dụng scale tuyến tính
                beginAtZero: true
            }
        }
    };
    return (
        <Flex gap={20} vertical>
            <Row style={{
                textAlign: 'center', justifyContent: 'center',
            }}> <strong style={{ fontSize: 30 }}>Cửa hàng TunzClothes</strong></Row>

            <Row style={{
                textAlign: 'center', justifyContent: 'center',
            }}> <strong style={{ fontSize: 20 }}>Người dùng</strong></Row>
            <Row>
                <Col span={24}>
                    <Flex justify='space-evenly' >
                        <Card bordered={false}>
                            <Statistic
                                title="Tổng số người dùng"
                                value={parseInt(allUsers?.length)}
                                loading={allUsersLoading}
                                valueStyle={{
                                    color: 'black',
                                }}
                                // prefix={<FontAwesomeIcon icon="fa-thin fa-house" />}
                                suffix="người"
                            />
                        </Card>
                        <Card bordered={false}>
                            <Statistic
                                title="Đang hoạt động"
                                value={onlineUsers?.length}
                                valueStyle={{
                                    color: '#65EA21',
                                }}
                                loading={onlineUsersLoading}
                                // prefix={<ArrowUpOutlined />}
                                suffix="người"
                            />
                        </Card>
                        <Card bordered={false}>
                            <Statistic
                                title="Offline"
                                value={offlineUsers?.length}
                                loading={offlineUsersLoading}
                                valueStyle={{
                                    color: '#869FA4',
                                }}
                                // prefix={<ArrowUpOutlined />}
                                suffix="người"
                            />
                        </Card>
                    </Flex>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Tabs
                        defaultActiveKey="1"
                        centered
                        items={[
                            {
                                key: '1',
                                label: 'Thống kê người dùng',
                                children: <PieChart label={userCountsLabels} dataa={userCountsData} />
                            },
                            {
                                key: '2',
                                label: 'Số lượng mua của người dùng',
                                children: <BarChart
                                    allName={usersName}
                                    allData={userPurcharseCount}
                                    lablel={'Đã mua'}
                                />,
                            },
                        ]}
                    />
                </Col>
            </Row>
            <Row style={{
                textAlign: 'center', justifyContent: 'center',
            }}> <strong style={{ fontSize: 20 }}>Sản phẩm</strong></Row>

            <Row>
                <Col span={24}>
                    <Flex justify='space-evenly' >
                        <Card bordered={false}>
                            <Statistic
                                title="Tổng số sản phẩm"
                                value={allProducts?.length}
                                loading={allProductsLoading}
                                valueStyle={{
                                    color: 'black',
                                }}
                                // prefix={<FontAwesomeIcon icon="fa-thin fa-house" />}
                                suffix="sản phẩm"
                            />
                        </Card>
                        <Card bordered={false}>
                            <Statistic
                                title="Đang bán"
                                value={activeProducts?.length}
                                valueStyle={{
                                    color: '#65EA21',
                                }}
                                loading={activeProductsLoading}
                                // prefix={<ArrowUpOutlined />}
                                suffix="sản phẩm"
                            />
                        </Card>
                        <Card bordered={false}>
                            <Statistic
                                title="Đã ngừng bán"
                                value={inActiveProducts?.length}
                                loading={inActiveProductsLoading}
                                valueStyle={{
                                    color: '#869FA4',
                                }}
                                // prefix={<ArrowUpOutlined />}
                                suffix="sản phẩm"
                            />
                        </Card>
                    </Flex>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Tabs
                        defaultActiveKey="1"
                        centered
                        items={[
                            {
                                key: '1',
                                label: 'Thống kê lượt bán của sản phẩm',
                                children: <BarChart
                                    allName={allProductsName}
                                    allData={allProductsSold}
                                    lablel={'Số lượng bán ra'}
                                />
                            },
                            {
                                key: '2',
                                label: 'Đánh giá của sản phẩm',
                                children: <PieChart label={allProductsRatingName} dataa={allProductsRatingCount} />,
                            },
                        ]}
                    />
                </Col>
            </Row>
        </Flex>
    )
}

export default ManageStatisticalPage