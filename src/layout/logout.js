import React from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router'
import { auth } from '../Services/firebase';
import { updateUserLogout } from '../APi';
import { Alert, Flex, Spin } from 'antd';

function Logout() {
    const uid = localStorage.getItem('uid')
    const navigate = useNavigate();
    signOut(auth).then(async () => {
        await updateUserLogout(uid)
        localStorage.removeItem("uid");
        navigate("/login");
    }).catch((error) => {
        console.error('Lỗi khi đăng xuất:', error);
    });
    return (
        <div>
            <Spin tip="Đang đăng xuất..." fullscreen size="large">
                <div className="content" />
            </Spin>
        </div>
    )
}

export default Logout