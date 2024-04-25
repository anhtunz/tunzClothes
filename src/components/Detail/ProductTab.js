import React, { useEffect, useState } from 'react'
import { Tabs, Typography, Collapse, Flex, Row, Rate, Avatar } from 'antd';
import { getCommentItemByproductID, getUserData } from '../../APi';

const { Title, Paragraph } = Typography;

function ProductTabs({ product }) {

    const items = [
        {
            key: '1',
            label: 'Mô tả sản phẩm',
            children: <ProductDescription productDescription={product?.pr_description} />,
        },
        {
            key: '2',
            label: 'Đánh Giá - Nhận Xét Từ Khách Hàng',
            children: <ProductFeedBack productID={product?.id} />,
        },
        {
            key: '3',
            label: 'Chính sách đổi trả',
            children: <PaymentChangePolicy />,
        },
        {
            key: '4',
            label: 'Câu hỏi thường gặp',
            children: <CommonQuestions />,
        },
    ];

    return (
        <div
            style={{
                padding: '40px'
            }}
        >
            <Tabs
                defaultActiveKey="1"
                centered
                items={items}
            />

        </div>
    )
}

function ProductDescription({ productDescription }) {
    return (
        <div dangerouslySetInnerHTML={{ __html: productDescription }}>
        </div>
    )
}

function ProductFeedBack({ productID }) {

    const [comments, setComments] = useState(null)
    const fetchComments = async (productID) => {
        try {
            const commentsData = await getCommentItemByproductID(productID)
            setComments(commentsData)
        } catch (error) {
            console.log("Erorr to get comments: ", error);
        }
    }
    const [usernames, setUsernames] = useState({});
    const [userImgs, setUserImgs] = useState({});
    const fetchUsernames = async (comments) => {
        const usernamesMap = {};
        const userImgsMap = {};
        await Promise.all(
            comments.details.map(async (comment) => {
                try {
                    const data = await getUserData(comment?.uid);
                    usernamesMap[comment?.uid] = data.username;
                    userImgsMap[comment?.uid] = data.image
                } catch (error) {
                    console.log("Error getting username: ", error);
                }
            })
        );
        setUsernames(usernamesMap);
        setUserImgs(userImgsMap);
    };

    useEffect(() => {
        fetchComments(productID);
    }, [])

    useEffect(() => {
        if (comments !== null) {
            fetchUsernames(comments);
        }
    }, [comments]);
    console.log("Comment in PrID: ", comments);
    return (
        <div>
            {/* <span>Mã sản phẩm: {productID}</span> */}
            {comments === null ? (
                <p>Chưa có đánh giá về sản phẩm này.</p>
            ) : (

                <div>
                    {comments?.details.map((comment, index) => (
                        <Flex key={index} align='center'>
                            <Row style={{ alignItems: 'center' }}>
                                <Avatar shape='circle' src={userImgs[comment?.uid]}> </Avatar>
                                <Flex vertical style={{ marginLeft: 10 }}>
                                    <Row>
                                        <strong >{usernames[comment?.uid]}</strong>
                                        <Rate disabled value={comment?.rate} allowHalf style={{ marginLeft: 15 }}></Rate>
                                    </Row>
                                    <div dangerouslySetInnerHTML={{ __html: comment?.evaluate }}></div>
                                </Flex>
                            </Row>

                        </Flex>
                    ))}
                </div>
            )}
        </div>
    )
}
function PaymentChangePolicy() {
    return (
        <Flex>
            <Typography>
                <Title level={4}>1. CHÍNH SÁCH ÁP DỤNG</Title>

                <Paragraph style={{
                    lineHeight: 3
                }}>
                    Trong vòng 30 ngày kể từ ngày mua sản phẩm với các sản phẩm của TunzClothes.<br />

                    Áp dụng đối với sản phẩm nguyên giá và sản phẩm giảm giá ít hơn 50%.<br />

                    Sản phẩm nguyên giá chỉ được đổi 01 lần duy nhất sang sản phẩm nguyên giá khác và không thấp hơn giá trị sản phẩm đã mua.<br />

                    Sản phẩm giảm giá/khuyến mại ít hơn 50% được đổi 01 lần sang màu khác hoặc size khác trên cùng 1 mã trong điều kiện còn sản phẩm hoặc theo quy chế chương trình (nếu có).

                    Nếu sản phẩm đổi đã hết hàng khi đó KH sẽ được đổi sang sản phẩm khác có giá trị ngang bằng hoặc cao hơn. Khách hàng sẽ thanh toán phần tiền chênh lệch nếu sản phẩm đổi có giá trị cao hơn sản phẩm đã mua.<br />

                    Chính sách chỉ áp dụng khi sản phẩm còn hóa đơn mua hàng, còn nguyên nhãn mác, thẻ bài đính kèm sản phẩm và sản phẩm không bị dơ bẩn, hư hỏng bởi những tác nhân bên ngoài cửa hàng sau khi mua sản phẩm.<br />

                    Sản phẩm đồ lót và phụ kiện không được đổi trả.

                </Paragraph>

                <Title level={4}>2. ĐIỀU KIỆN ĐỔI SẢN PHẨM</Title>

                <Paragraph style={{
                    lineHeight: 3
                }}>
                    Đổi hàng trong vòng 07 ngày kể từ ngày khách hàng nhận được sản phẩm.<br />

                    Sản phẩm còn nguyên tem, mác và chưa qua sử dụng.

                </Paragraph>
                <Title level={4}>3. THỰC HIỆN ĐỔI SẢN PHẨM</Title>

                <Paragraph style={{
                    lineHeight: 3
                }}>
                    Quý khách có thể đổi hàng Online tại hệ thống cửa hàng và đại lý TunzClothes trên toàn quốc . Lưu ý: vui lòng mang theo sản phẩm và phiếu giao hàng.<br />

                    Nếu tại khu vực bạn không có cửa hàng TunzClothes hoặc sản phẩm bạn muốn đổi thì vui lòng làm theo các bước sau:<br />

                    Bước 1: Gọi đến Tổng đài: 099999999 các ngày trong tuần (trừ ngày lễ), cung cấp mã đơn hàng và mã sản phẩm cần đổi.<br />

                    Bước 2: Vui lòng gửi hàng đổi về địa chỉ : Kho TunzClothes - Hai Bà Trưng - Hà Nội.<br />

                    Bước 3: TunzClothes gửi đổi sản phẩm mới khi nhận được hàng. Trong trường hợp hết hàng, TunzClothes sẽ liên hệ xác nhận.<br />
                    <br />
                </Paragraph>


            </Typography>
        </Flex>
    )
}
function CommonQuestions() {
    const items = [
        {
            key: '1',
            label: <span style={{
                fontWeight: 'bold'
            }}
            >
                Tôi có được xem hàng và thử không? </span>,
            children:
                <p>
                    Dạ anh chị có thể xem hàng trước khi thanh toán!
                    Hiện tại TunzClothes chưa áp dụng chính sách thử hàng khi mua hàng online!
                    Rất mong anh chị thông cảm!
                </p>,
        },
        {
            key: '2',
            label: <span style={{
                fontWeight: 'bold'
            }}
            >
                Tôi muốn đổi màu (size) thì cần làm gì? </span>,
            children:
                <p>
                    Dạ anh/chị có thể đổi hàng 1 lần duy nhất trong vòng 7 ngày tại bất kỳ cơ sở của TunzClothes
                    hoặc gửi về kho online với điều kiện sản phẩm còn nguyên tem mác gắn liền sản phẩm và hóa đơn
                    áp dụng cho những sản phẩm có mức sale nhỏ hơn 50%.
                </p>,
        },
        {
            key: '3',
            label: <span style={{
                fontWeight: 'bold'
            }}
            >
                Tôi mua hàng rồi, không vừa ý có thể đổi lại hay không? </span>,
            children:
                <p>
                    Khi mua hàng nếu khách hàng không vừa ý với sản phẩm, hãy cho TunzClothes được biết, chúng tôi sẽ đổi ngay sản phẩm cho khách hàng.
                    Chỉ cần đảm bảo sản phẩm chưa qua sử dụng, còn nguyên tem nhãn. Chúng tôi sẽ hỗ trợ đổi (size, màu, sản phẩm khác) cho khách hàng.
                </p>,
        },
    ];
    return (
        <div>
            <Collapse items={items} defaultActiveKey={['1']} />;
        </div>
    )
}

export default ProductTabs