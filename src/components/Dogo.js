import React, { useContext } from 'react'
import '../styles/Dogo.css'
import { DogosContext } from './Dogos'

function Dogo(props) {
    const dogoCardCallback = useContext(DogosContext)

    const handleDeleteDogoButton = () => {
        dogoCardCallback({action: 'DOGO_DELETE', id: props.dogoData.id})
    } 

    const handleEditDogoButton = () => {
        dogoCardCallback({action: 'DOGO_EDIT', id: props.dogoData.id})
    }

    return (
        <div
            className='dogoCard'
            style={{ position: 'relative' }}
        >
            <div
                className='dogoImage'
                style={{ backgroundImage: 'url(' + props.dogoData.imageUrl + ')' }}
            />
            <span
                className='dogoEditButton'
                onClick={handleEditDogoButton}
            >
                &#9998;
                    </span>
            <span
                className='dogoDeleteButton'
                onClick={handleDeleteDogoButton}
            >
                &#10006;
                    </span>
            <div
                className='dogoCardText'>
                {props.dogoData && props.dogoData.breed &&
                    <div>breed: {props.dogoData.breed}</div>}
                {props.dogoData && props.dogoData.subBreed &&
                    <div>sub-breed: {props.dogoData.subBreed}</div>
                }
            </div>
        </div>
    )
}

export default Dogo
