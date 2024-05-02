import React from 'react';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

export default function CaroselHomePage() {
    const navigate = useNavigate();
    return (
        <MDBCarousel showIndicators showControls fade style={{ maxHeight: '100%', width: '100%' }} >

            <MDBCarouselItem itemId={1} style={{
                cursor: 'pointer'
            }} onClick={() => { navigate('/collection/onSale') }}>
                <img
                    src='https://firebasestorage.googleapis.com/v0/b/tunztunzzclothing.appspot.com/o/11111.jpg?alt=media&token=1c417aae-be07-41f7-90ae-77b3696afebf'
                    className='d-block w-100'
                    alt='...' />
            </MDBCarouselItem>

            <MDBCarouselItem itemId={2} style={{
                cursor: 'pointer'
            }} onClick={() => { navigate('/collection/onSale') }}>
                <img src='https://firebasestorage.googleapis.com/v0/b/tunztunzzclothing.appspot.com/o/H%E1%BA%A1t%20Nh%C3%A0i.png?alt=media&token=fc8035d3-31b6-4b74-97c5-941b7bff370c'
                    height='100%'
                    className='d-block w-100'
                    alt='...'
                    style={{
                        objectFit: "fill",
                        maxHeight: '100%'
                    }}
                />
            </MDBCarouselItem>


        </MDBCarousel >
    );
}