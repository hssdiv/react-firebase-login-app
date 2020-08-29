import React, { useEffect, useState, useContext } from 'react'
import { getRandomDogo } from '../api/DogApi'
import '../styles/Dogo.css'
import Spinner from './Spinner'
import SimpleErrorMessage from './SimpleErrorMessage'
import { DogosContext } from './Dogos'

function Dogo() {
    const [myDogoBreed, setMyDogoBreed] = useState(null)
    const [myDogoSubBreed, setMyDogoSubBreed] = useState(null)
    const [myDogos, setMyDogos] = useState({})
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)

    useEffect(() => {
        getRandomDogo(setMyDogos, setSpinnerIsVisible)
    }, [])

    //callback from api call
    useEffect(() => {
        if ((myDogos.message) && (myDogos.message.includes('breeds'))) {
            const breedName = getFullBreedName(myDogos.message)

            if (breedName.includes('-')) {
                const [masterBreed, subBreed] = breedName.split('-')
                setMyDogoBreed(masterBreed)
                setMyDogoSubBreed(subBreed)
            } else {
                setMyDogoBreed(breedName)
            }
        }

    }, [myDogos])

    function getFullBreedName(url) {
        const position = url.indexOf('breeds');
        const start = position + 7
        const end = url.indexOf('/', start)
        return url.substring(start, end)
    }

    const setShowConfirmDeleteModal = useContext(DogosContext)

    const handleDeleteDogoButton = () => {
        setShowConfirmDeleteModal(true)
    }

    return (
        <>
            <div
                className='dogoCard'
                style={{ position: 'relative' }}
            >
                {myDogos.error ?
                    <SimpleErrorMessage
                        error='error while loading dogo'
                    />
                    :
                    <>
                        <div
                            className='dogoImage'
                            style={{ backgroundImage: 'url(' + myDogos.message + ')' }}
                        />
                        <span
                        className='dogoDeleteButton'
                        onClick={handleDeleteDogoButton}
                        >
                            &#10006;
                        </span>
                        <div
                            className='dogoCardText'>
                            {myDogoBreed &&
                                <div>breed: {myDogoBreed}</div>}
                            {myDogoSubBreed &&
                                <div>sub-breed: {myDogoSubBreed}</div>
                            }
                        </div>
                    </>
                }
                {spinnerIsVisible &&
                    <Spinner 
                        style={{ position: 'relative', top: '125px', left: '125px' }} 
                    />
                }
            </div>
        </>
    )
}

export default Dogo
