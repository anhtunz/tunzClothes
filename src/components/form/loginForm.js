import React, { useEffect } from 'react'
import {
    MDBBtn,
    MDBInput
}
    from 'mdb-react-ui-kit';
import { useLocation } from 'react-router-dom';
import Notification from '../toast';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../../Services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = React.useState("")
    const [pass, setPass] = React.useState("")
    const [showNotification, setShowNotification] = React.useState(false);
    const successState = location.state?.success;

    useEffect(() => {
        if (successState) {
            const type = 'success';
            toast('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.', {
                type: type
            });
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        const errorType = 'error'
        const successType = 'success'
        e.preventDefault()
        if (!validateEmail(email)) {
            setShowNotification(true)
            console.log(showNotification);
            toast('Email không hợp lệ', { type: errorType });
            return;
        }
        if (pass.length < 6) {
            console.log("Mật khẩu phải có ít nhất 6 kí tự");
            setShowNotification(true)
            toast('Mật khẩu phải có ít nhất 6 kí tự', { type: errorType });
            return;
        }

        try {
            signInWithEmailAndPassword(auth, email, pass)
                .then((userCredential) => {
                    const uid = userCredential.user.uid
                    setShowNotification(true)
                    toast('Đăng nhập thành công', { type: successType });
                    localStorage.setItem("uid", uid)
                    navigate("/", { state: { successLogin: true } })
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setShowNotification(true);
                    toast('Tài khoản hoặc mật khẩu không đúng', { type: errorType });
                    console.log(errorMessage);
                });
        } catch (error) {
            setShowNotification(true)
            toast('Đăng nhập thất bại, vui lòng nhập lại', { type: errorType });
        }

    }

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    return (

        <form className='d-flex flex-column justify-content-center h-custom-3 w-75 pt-4' onSubmit={handleLogin}>
            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Đăng nhập</h3>
            <MDBInput
                wrapperClass='mb-4 mx-5 w-100'
                label='Email: '
                id='email'
                type='text'
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <MDBInput
                wrapperClass='mb-4 mx-5 w-100'
                label='Mật khẩu'
                id='password'
                type='password'
                size="lg"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
            />
            <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg'>Đăng nhập</MDBBtn>
            {(successState || showNotification)
                && <Notification position="top-left" />}
            <p className="small mb-5 pb-lg-3 ms-5"><a className="text-muted" href="#!">Quên mật khẩu?</a></p>
            <p className='ms-5'>Chưa có tài khoản? <a href="/register" className="link-info">Đăng kí ngay</a></p>
        </form>
    )
}

export default LoginForm