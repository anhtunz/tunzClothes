import React from 'react'
import '../App.css'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
}
  from 'mdb-react-ui-kit';
import SignUpForm from '../components/form/signupForm';
import { useNavigate } from 'react-router-dom';
function SignUpPage() {
  const navigate = useNavigate();
  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol sm='6'>
          <div className='d-flex flex-row ps-5 pt-5'>
            <span
              className="h1 fw-bold mb-0"
              style={{
                cursor: 'pointer'
              }}
              onClick={() => {
                console.log("Da click");
                navigate("/")
              }}
            >
              <img
                src='https://firebasestorage.googleapis.com/v0/b/tunztunzzclothing.appspot.com/o/logo-Photoroom.png-Photoroom.png?alt=media&token=41f23438-d0f9-4b0d-9286-704bf35a9e63'
              ></img>
            </span>
          </div>
          <SignUpForm />

        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tunztunzzclothing.appspot.com/o/999.jpg?alt=media&token=33cfa2a9-7757-401b-8678-42f2a72a6637"
            alt="Login image"
            className="w-100"
            style={{
              objectFit: 'fill',
              objectPosition: 'left',
              height: 776
            }}
          />
        </MDBCol>

      </MDBRow>

    </MDBContainer>
  )
}

export default SignUpPage