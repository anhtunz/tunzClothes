import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function Footer() {
    return (
        <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
            <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
                <div className='me-5 d-none d-lg-block'>
                    <span>Liên hệ mình qua các nền tảng:</span>
                </div>

                <div>
                    <a href='https://www.facebook.com/tunztunzz/' className='me-4 text-reset'>
                        <MDBIcon fab icon="facebook-f" />
                    </a>
                    <a href='anhtuanmk62@gmail.com' className='me-4 text-reset'>
                        <MDBIcon fab icon="google" />
                    </a>
                    <a href='https://github.com/anhtunz' className='me-4 text-reset'>
                        <MDBIcon fab icon="github" />
                    </a>
                </div>
            </section>

            <section className=''>
                <MDBContainer className='text-center text-md-start mt-5'>
                    <MDBRow className='mt-3'>
                        <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>
                                <MDBIcon icon="gem" className="me-3" />
                                Đồ án tốt nghiệp hệ cử nhân
                            </h6>
                            <p>
                                Đồ án được thực hiện bởi Trần Anh Tuấn - 1554965
                                sinh viên lớp 65PM4, Khoa Công Nghệ Thông Tin,
                                Trường Đại Học Xây Dựng Hà Nội
                            </p>
                        </MDBCol>

                        <MDBCol md="4" lg="3" xl="4" className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Thông tin liên hệ</h6>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Địa chỉ: Số 55 đường Giải Phóng, Hai Bà Trưng, Hà Nội
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Điện thoại: (024) 38 696 397
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Email: dhxaydung@huce.edu.vn
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Fax: 024.38.691.684
                                </a>
                            </p>
                        </MDBCol>



                        <MDBCol md="3" lg="2" xl="3" className='mx-auto mb-md-0 mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Cá nhân</h6>
                            <p>
                                <MDBIcon icon="home" className="me-2" />
                                Trương Định, Hai Bà Trưng, Hà Nội
                            </p>
                            <p>
                                <MDBIcon icon="envelope" className="me-3" />
                                anhtuanmk62@gmail.com
                            </p>
                            <p>
                                <MDBIcon icon="phone" className="me-3" /> (+89) 777 576 333
                            </p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2021 Copyright:
                <a className='text-reset fw-bold' href='https://huce.edu.vn/'>
                    Đại Học Xây Dựng Hà Nội
                </a>
            </div>
        </MDBFooter>
    );
}