import React from 'react'
import '../styles/App.css';

function SimpleErrorMessage(props) {
    return (
        <div className='error'>
            {props.error}
        </div>
    )
}

export default SimpleErrorMessage
