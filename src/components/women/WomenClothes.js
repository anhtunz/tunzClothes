import React,{useState} from 'react'
import { MDBBadge, MDBIcon } from 'mdb-react-ui-kit';
function WomenClothes() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };


  return (
    <div className="navbar">
      <a className='mx-3' href='#!'>
        <MDBIcon fas icon='envelope' size='lg' />
        <MDBBadge color='danger' notification pill>
          199
        </MDBBadge>
      </a>
    </div>
  );
}

export default WomenClothes