import { ToastContainer } from 'react-toastify';
import React from 'react';

function Notification({position}) {
    return (
        <div>
            <ToastContainer
                position={position}
                autoClose={3000}
                closeOnClick
            />
        </div>
    );

}

export default Notification;