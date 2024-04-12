import React from 'react';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';

export default function CaroselHomePage() {
    return (
        <MDBCarousel showIndicators showControls fade style={{ maxHeight: '100%', width: '100%' }} >
            <MDBCarouselItem itemId={1}>
                <img src='https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(23).webp'
                    height='100%'
                    className='d-block w-100'
                    alt='...'
                    style={{
                        objectFit: "fill",
                        maxHeight:'100%'
                    }}
                />
                <MDBCarouselCaption>
                    <h5>First slide label</h5>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </MDBCarouselCaption>
            </MDBCarouselItem>

            <MDBCarouselItem itemId={2}>
                <img src='https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(15).webp' className='d-block w-100' alt='...' />
                <MDBCarouselCaption>
                    <h5>Second slide label</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </MDBCarouselCaption>
            </MDBCarouselItem>

            <MDBCarouselItem itemId={3}>
                <img src='https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(23).webp' alt='...' />
                <MDBCarouselCaption>
                    <h5>Third slide label</h5>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </MDBCarouselCaption>
            </MDBCarouselItem>
        </MDBCarousel >
    );
}