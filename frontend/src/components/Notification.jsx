import React from 'react';

function Notification({ message }) {
    return (
        <div className={`notification ${message ? 'show' : ''}`}>
            {message}
        </div>
    );
}

export default Notification;
