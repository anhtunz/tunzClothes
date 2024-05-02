import React, { useEffect, useState } from 'react'
import { Flex, Col, Row, Table, Image, Tag, Button, message, Modal, Input, Select, Avatar } from 'antd'
import { deleteUserByUID, getAllUser, updateUser } from '../APi'
import {
    EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../Services/firebase';


function ManageUserPage() {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([])
    const [isEdditing, setEdditing] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [oldPass, setOldPass] = useState("")
    useEffect(() => {
        setLoading(true);
        fetchUserData();
    }, [])
    const fetchUserData = async () => {
        const users = await getAllUser();
        if (users) {
            setUserData(users)
            setLoading(false)
        }
        else {
            setUserData([]);
        }
    }

    const columns = [
        {
            key: "uid",
            title: "UID",
            dataIndex: "uid",
            width: 300
        },
        {
            key: "image",
            title: "Ảnh đại diện",
            dataIndex: "image",
            width: 150,
            render: (image) => (
                <Image src={image} alt="user avatar" style={{ width: 50, height: 50, borderRadius: 50 }} />
            ),
        },
        {
            key: "email",
            title: "Email",
            dataIndex: 'email',
            with: 200
        },
        {
            key: "username",
            title: "Nick name",
            dataIndex: "username",
        },
        {
            key: "role",
            title: "Role",
            dataIndex: "role",
        },
        {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (status) => (status === "0" ? <Tag color="#2db7f5">Offline</Tag> : <Tag color="#87d068">Online</Tag>)
        },
        {
            key: "description",
            title: "Mô tả",
            dataIndex: "description",
        },
        {
            key: "purchase_ordered",
            title: "Đã mua",
            dataIndex: "purchase_ordered",
        },
        {
            key: "11",
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
                                onEditUser(record)
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
                                onDeleteUser(record);
                            }}
                        >
                            Xóa
                        </Button>
                    </>
                );
            },
        },
    ];


    const sendEmailToUser = (password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "emailHost": "anhtuanmk62@gmail.com",
                "password": "nbmb mmbg svpk oxzm",
                "displayName": "TunzClothes Notification",
                "toMail": "anhtuanmk62@gmail.com",
                "title": "Thông báo từ TunzClothes",
                "body": `<p><strong>Thông báo thay đổi mật khẩu: </strong></p><p>Mật khẩu của bạn đã được thay đổi thành: ${password}</p>`
            })
        };
        fetch('https://exciting-snail-new.ngrok-free.app/api/send-mail', requestOptions)
            .then(response => response.json())
            .catch(err => {
                console.log(err);
            });
    }

    const onDeleteUser = (record) => {
        Modal.confirm({
            title: `Bạn có chắc chắn muốn xóa người dùng "${record.username}" này?`,
            onOk: async () => {
                const result = await deleteUserByUID(record.uid);
                if (result === true) {
                    message.success("Xóa người dùng thành công")
                    await fetchUserData();
                }
                else {
                    message.err("Xóa người dùng thất bại!")
                }
            }
        })
    }

    const onEditUser = (record) => {
        setEdditing(true)
        setEditUser({ ...record })
        setImageUrl(record.image)
        setOldPass(record.password)
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImageUrl(reader.result)
            }
            try {
                const imageRef = ref(storage, `avatars/${file.name + uuidv4()}`)
                const uploadImage = uploadBytesResumable(imageRef, file);
                await uploadImage;
                const imageUrl = await getDownloadURL(uploadImage.snapshot.ref);
                if (imageUrl) {
                    setEditUser({
                        ...editUser, image: imageUrl
                    })
                    e.target.value = '';
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
                >Danh sách người dùng </Col>
            </Row>
            <Table
                scroll={{
                    x: 2000,
                }}
                key={"table"}
                loading={loading}
                columns={columns}
                dataSource={userData}
            >
            </Table>
            <Modal
                title={`Chỉnh sửa người dùng ${editUser?.username}`}
                open={isEdditing}
                okText="Xác nhận"
                cancelText="Hủy"
                onCancel={() => {
                    setEdditing(false)
                }}
                onOk={async () => {
                    console.log("Password cu: ", oldPass);
                    setEdditing(false);
                    const today = new Date();
                    const updatedUser = { ...editUser, updated_time: today };
                    if (updatedUser.password !== oldPass) {
                        sendEmailToUser(updatedUser.password)
                    }
                    else {
                        // console.log("password khong thay doi");
                    }
                    const result = await updateUser(updatedUser);
                    setEditUser(updatedUser);
                    await fetchUserData();
                    if (result === true) {
                        message.success(`Sửa thông tin người dùng ${editUser.username} thành công`)
                    } else {
                        message.error(`Sửa thông tin người dùng ${editUser.username} thất bại`)
                    }

                }}
            >
                <Row
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Avatar size={200}
                        src={imageUrl}
                    >
                    </Avatar>
                    <Input
                        onChange={handleImageChange}
                        type={"file"}
                    ></Input>
                </Row>
                <Row style={{
                    marginBottom: 10
                }}>
                    <strong>Email: </strong>
                    <Input
                        disabled
                        style={{
                            marginTop: 5
                        }}
                        value={editUser?.email}
                        onChange={(e) => {
                            setEditUser(pre => {
                                return { ...pre, email: e.target.value }
                            }
                            )
                        }}
                    />
                </Row>
                <Row style={{
                    marginBottom: 10
                }}>
                    <strong>Username: </strong>
                    <Input
                        style={{
                            marginTop: 5
                        }}
                        value={editUser?.username}
                        onChange={(e) => {
                            setEditUser(pre => {
                                return { ...pre, username: e.target.value }
                            }
                            )

                        }}
                    />
                </Row>
                <Row style={{
                    marginBottom: 10
                }}>
                    <strong>Mật khẩu: </strong>
                    <Input.Password
                        style={{
                            marginTop: 5
                        }}
                        value={editUser?.password}
                        onChange={(e) => {
                            setEditUser(pre => {
                                return { ...pre, password: e.target.value }
                            }
                            )

                        }}
                    />
                </Row>
                <Row style={{
                    marginBottom: 10
                }}>
                    <strong>Vai trò: </strong>
                    <Col>
                        <Select
                            style={{
                                marginLeft: 10
                            }}
                            defaultValue={editUser?.role}
                            options={[
                                {
                                    value: 'USER',
                                    label: 'Người dùng'
                                },
                                {
                                    value: 'MANAGER',
                                    label: 'Nhân viên'
                                },
                                {
                                    value: 'ADMIN',
                                    label: 'Admin'
                                },
                            ]}
                        >
                        </Select>
                    </Col>
                </Row>

            </Modal>
        </Flex>
    )
}

export default ManageUserPage