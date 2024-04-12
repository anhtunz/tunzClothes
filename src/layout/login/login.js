import React from 'react';
import './login.css'
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
}
    from 'mdb-react-ui-kit';
import LoginForm from '../../components/form/loginForm';

function LoginPage() {

    return (
        <MDBContainer fluid>
            <MDBRow>
                <MDBCol sm='6'>
                    <div className='d-flex flex-row ps-5 pt-5'>
                        <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }} />
                        <span className="h1 fw-bold mb-0">Logo</span>
                    </div>
                    <LoginForm />

                </MDBCol>

                <MDBCol sm='6' className='d-none d-sm-block px-0'>
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                        alt="Login image" className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                </MDBCol>

            </MDBRow>

        </MDBContainer>
    );
}

export default LoginPage;