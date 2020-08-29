import React from 'react'
import '../styles/Dogo.css'

function AddDogoCard(props) {
    return (
        <>
            <div
                className='dogoCard'
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={props.onClick}
            >
                <>
                    <span
                        role='img'
                        className='dogoAddButton'
                        style={{ position: 'relative', top: '140px'}}
                    >
                        &#10010;
                        </span>
                    <div
                    style={{ position: 'relative', top: '170px'}}>
                        Add Dogo
                        </div>
                </>
            </div>
        </>
    )
}

export default AddDogoCard
