import React from 'react'
import '../styles/Dog.css'

function AddDogCard(props) {
    return (
        <div
            className='dogCard'
            style={
                {
                    position: 'relative',
                    cursor: 'pointer',
                    height: '350px'
                }}
            onClick={props.onClick}
        >
            <>
                <span
                    role='img'
                    className='dogAddButton'
                    style={{ position: 'relative', top: '140px' }}
                >
                    &#10010;
                        </span>
                <div
                    style={{ position: 'relative', top: '170px' }}>
                    Add Dog
                </div>
            </>
        </div>
    )
}

export default AddDogCard
