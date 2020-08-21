import React, { useEffect, useState } from 'react'
import { getRandomDogo } from '../api/DogApi'

function Dogo() {
    const [myDogoBreed, setMyDogoBreed] = useState(null)
    const [myDogoSubBreed, setMyDogoSubBreed] = useState(null)
    const [myDogos, setMyDogos] = useState({})

    useEffect(() => {
        getRandomDogo(setMyDogos)
    }, [])

    useEffect(() => {
        console.log(myDogos.message)
        console.log(myDogos)
        if ((myDogos.message) && (myDogos.message.includes("breeds"))) {
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
        const position = url.indexOf("breeds");
        const start = position + 7
        const end = url.indexOf('/', start)
        return url.substring(start, end)
    }

    return (
        <div>
            {myDogos.error ?
                <div>
                    error while loading dogo
                </div>
                :
                <>
                    {myDogoBreed &&
                        <div>breed: {myDogoBreed}</div>}
                    {myDogoSubBreed ?
                        <div>sub breed: {myDogoSubBreed}</div>
                    :
                        <div>not a sub breed</div>
                    }
                    <img src={myDogos.message} alt=' ' width="300" />
                </>
            }
            
        </div>
    )
}

export default Dogo
