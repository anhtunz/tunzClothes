import React, { useEffect, useState } from 'react'
import { Col, Row, Flex, Button, Input, Avatar } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined, HistoryOutlined } from '@ant-design/icons';
import { getUserData, updateProfileImage } from '../../APi';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Outlet, useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../Services/firebase';


function ProfilePage() {
    const navigate = useNavigate();
    const image = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
    const [imageUrl, setImageUrl] = useState(image);

    const [userData, setUserData] = useState({})
    const uid = localStorage.getItem("uid");
    useEffect(() => {
        fetchData();
    }, [uid]);

    const fetchData = async () => {
        const data = await getUserData(uid);
        setUserData(data);
        if (data) {
            setImageUrl(data?.image)
        }
        else {
            setImageUrl(image)
        }
    };

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
                    setUserData({
                        ...userData, image: imageUrl
                    })
                    await updateProfileImage(userData.uid, imageUrl)
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

    const Logout = () => {
        navigate("/logout")
    }
    return (
        <>
            <Row style={{
                height: 100,
                //   background:'gray'
                marginBottom: 100
            }}>
                <Col
                    span={2}
                >
                </Col>
                <Col
                    span={8}
                    style={{
                        height: 100
                    }}
                >
                    <Flex vertical gap={20} justify='center' align='center'>
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
                        <Button type='primary' block icon={<UserOutlined />} onClick={() => { navigate("/user/profile") }}> Thông tin người dùng</Button>
                        <Button type='primary' block icon={<LockOutlined />} onClick={() => { navigate("/user/change-pass") }}> Đổi mật khẩu</Button>
                        <Button type='primary' block icon={<HistoryOutlined />}> Lịch sử mua hàng</Button>
                        <Button
                            type='primary'
                            block
                            danger
                            icon={<LogoutOutlined />}
                            onClick={Logout}
                        > Đăng xuất</Button>

                    </Flex>
                </Col>
                <Col
                    span={1}
                >
                </Col>
                <Col
                    span={12}
                >
                    <Outlet />
                    {/* <UserProfile user={userData} /> */}
                    {/* <ChangePass /> */}
                </Col>

            </Row>
        </>
    )
}

export default ProfilePage