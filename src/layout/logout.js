import React from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router'
import { auth } from '../Services/firebase';

function Logout() {
    const navigate = useNavigate();
    signOut(auth).then(() => {
        localStorage.removeItem("uid");
        navigate("/login");
    }).catch((error) => {
        console.error('Lỗi khi đăng xuất:', error);
    });
    return (
        <div>
            Logoutttt Page
        </div>
    )
}

export default Logout