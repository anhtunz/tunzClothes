import React from 'react'
import {
    MDBBtn,
    MDBInput
}
    from 'mdb-react-ui-kit';
import { db, auth } from '../../Services/firebase'
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from "react-router-dom";
import Notification from '../toast';

function SignUpForm() {
    const [email, setEmail] = React.useState('')
    const [pass, setPass] = React.useState('')
    const [confirmPass, setConfirmPass] = React.useState('')
    const [showNotification, setShowNotification] = React.useState(false);
    const navigate = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        const errorType = 'error'
        const successType = 'success'
        if (!validateEmail(email)) {
            setShowNotification(true)
            toast('Email không hợp lệ', { type: errorType });
            return;
        }

        // Kiểm tra mật khẩu có ít nhất 6 kí tự không
        if (pass.length < 6) {
            console.log("Mật khẩu phải có ít nhất 6 kí tự");
            setShowNotification(true)
            toast('Mật khẩu phải có ít nhất 6 kí tự', { type: errorType });    
            return;
        }

        // Kiểm tra mật khẩu và xác nhận mật khẩu có giống nhau không
        if (pass !== confirmPass) {
            console.log("Mật khẩu và xác nhận mật khẩu không giống nhau");
            setShowNotification(true)
            toast('Mật khẩu xác thực không chính xác', { type: errorType });
            return;
        }
        const today = new Date();
        navigate("/login", { state: { success: true } });
        // Tiến hành thêm vào cơ sở dữ liệu và đăng ký người dùng
        try {           
            // Đăng ký người dùng
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
            console.log("Đăng ký thành công", user);
            setShowNotification(true)
            toast('Đăng kí tài khoản thành công', { type: successType });
            setEmail("")
            setPass("")
            setConfirmPass("")
            navigate("/login", { state: { success: true } });

            await addDoc(collection(db, "users"), {
                created_time: today,
                description: "",
                email: email,
                image: "",
                password: pass,
                role: "USER",
                status: "",
                updated_time: today,
                username: "",
                uid: user.uid,
                purchase_ordered: 0
            });

        } catch (error) {
            setShowNotification(true)
            toast('Tài khoản đã tồn tại', { type: errorType });
            console.error("Đăng ký thất bại", error.message);
        }
    }
    // Hàm kiểm tra định dạng email
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    return (
        <form className='d-flex flex-column justify-content-center h-custom-3 w-75 pt-4' onSubmit={handleSignUp}>
            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Sign Up</h3>
            <MDBInput
                wrapperClass='mb-4 mx-5 w-100'
                label='Email address'
                id='email' type='text'
                size="lg" autoFocus
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <MDBInput
                wrapperClass='mb-4 mx-5 w-100'
                label='Password' id='password'
                type='password'
                size="lg"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
            />
            <MDBInput
                wrapperClass='mb-4 mx-5 w-100'
                label='Confirm Password'
                id='comfirmpassword'
                type='password'
                size="lg"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
            />
            <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg' >SignUp</MDBBtn>
            {showNotification && <Notification position= "top-left"/>}
            <p className="small mb-5 pb-lg-3 ms-5"><a className="text-muted">Forgot password?</a></p>
            <p className='ms-5'>Have an account? <a href="/login" className="link-info">Login</a></p>
        </form>
    )
}

export default SignUpForm