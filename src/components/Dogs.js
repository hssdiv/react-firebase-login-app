import React, { useState, useEffect } from 'react'
import Dog from './Dog'
import GetWidth from '../ui/useWindowSize'
import AddDogCard from './AddDogCard'
import { firestore } from '../config/firebase'
import { getRandomDog } from '../api/DogApi'
import Spinner from './Spinner'
import SimpleErrorMessage from './SimpleErrorMessage'

//TODO modal edit(or edit inside?)
//TODO move spinner outside so it can be hidden if error
//TODO disappearing\appearing animation?

function Dogs() {
    const currentScreenWidth = GetWidth()

    const [Dogs, setDogs] = useState(null)

    const [randomDog, setRandomDog] = useState({})

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)
    const [dogSpinnerIsVisible] = useState(false)

    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null)

    useEffect(() => {
        console.log('useEffect fetching Dogs from fs...')
        const db = firestore();
        const dogListenerUnsubscribe = db.collection('dogs').onSnapshot((snapshot) => {
            const dogsData = [];
            snapshot.forEach(doc => dogsData.push(({ id: doc.id, ...doc.data() })))
            setDogs(dogsData);
        })
        return dogListenerUnsubscribe
    }, [])

    useEffect(() => {
        console.log('changes to Dogs list:');
        if (Dogs) {
            console.log('Dogs size: ' + Dogs.length);
        }

    }, [Dogs])

    const handleAddDogOnClick = () => {
        setSpinnerIsVisible(true)
        getRandomDog(setRandomDog, setSpinnerIsVisible)
    }

    useEffect(() => {
        console.log('Getting random dog...')
        if ((randomDog.message) && (randomDog.message.includes('breeds'))) {
            const breedName = getFullBreedName(randomDog.message)

            const addDogToFs = (dogToAdd) => {
                const db = firestore();
                db.collection('dogs').add(dogToAdd);
            }

            if (breedName.includes('-')) {
                const [masterBreed, subBreed] = breedName.split('-')
                const dog = { breed: masterBreed, subBreed: subBreed, imageUrl: randomDog.message }
                console.log('adding dog' + dog.masterBreed + 'to firestore')

                addDogToFs(dog);
            } else {
                const dog = { breed: breedName, imageUrl: randomDog.message }
                console.log('adding dog' + dog.masterBreed + 'to firestore')
                addDogToFs(dog);
            }

            setSpinnerIsVisible(false)
        } else if (randomDog.error) {
            setSimpleErrorMsg(randomDog.error)
            setSpinnerIsVisible(false)
        }
    }, [randomDog])

    function getFullBreedName(url) {
        const position = url.indexOf('breeds');
        const BREED_AND_SLASH_LENGTH = 7;
        const start = position + BREED_AND_SLASH_LENGTH;
        const end = url.indexOf('/', start)
        return url.substring(start, end)
    }

    return (
        <div>
            <h1>Dogs page</h1>
            <SimpleErrorMessage
                error={simpleErrorMsg}
            />
            <div
                className='dogCardContainer'
                style={
                    currentScreenWidth > 1066 ?
                        {}
                        :
                        { maxWidth: '533px' }
                }
            >
                <AddDogCard onClick={handleAddDogOnClick} />
                {Dogs &&
                    Dogs.map(dog => (
                        <Dog 
                            key={dog.id} 
                            dogData={dog} 
                        />
                    ))}
                {dogSpinnerIsVisible &&
                    <Spinner />
                }
            </div>
            {spinnerIsVisible &&
                <Spinner />
            }
        </div>
    )
}

export default Dogs
