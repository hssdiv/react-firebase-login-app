import React, { useState, useEffect, useContext } from 'react'
import { Dog, AddDogCard, DogDeleteModal } from '../DogCards/'
import GetWidth from '../../ui/useWindowSize'
import { firestore } from '../../config/firebase'
import Spinner from '../Spinner'
import SimpleErrorMessage from '../SimpleErrorMessage'
import { DogsContext } from '../../context/DogsContext'

export function Dogs() {
    const currentScreenWidth = GetWidth()

    const [Dogs, setDogs] = useState(null)

    const [randomDog, setRandomDog] = useState({})

    const [deleteAllModalIsVisible, setDeleteAllModalIsVisible] = useState(false)
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)
    const [dogSpinnerIsVisible] = useState(false)

    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null)

    const { dogResult, dogMethods } = useContext(DogsContext)

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
        if (dogResult) {
            setRandomDog(dogResult)
        }
    }, [dogResult])

    useEffect(() => {
        console.log('changes to Dogs list:');
        if (Dogs) {
            console.log('Dogs size: ' + Dogs.length);
        }

    }, [Dogs])

    const handleAddDogOnClick = async () => {
        setSpinnerIsVisible(true)

        const result = await dogMethods.getRandomDog()
        if (result) {
            if (result.loaded) {
                setSpinnerIsVisible(false);
                setSimpleErrorMsg(null);
            } else {
                setSpinnerIsVisible(false);
                setSimpleErrorMsg('Coudn\'t get dogs from server');
            }
        } else {
            setSpinnerIsVisible(false);
            setSimpleErrorMsg('Coudn\'t get dogs from server');
        }
    }

    const handleDeleteAll = () => {
        //TODO confirm modal
        setDeleteAllModalIsVisible(true)
    }

    const modalDeleteAllCallback = (result) => {
        switch (result) {
            case 'MODAL_CLOSED':
                setDeleteAllModalIsVisible(false);
                break;
            case 'MODAL_DELETE_PRESSED':
                //setSpinnerIsVisible(true);
                setDeleteAllModalIsVisible(false);

                deleteCollection();
                break;
            default:
                return;
        }
    }

    function deleteCollection() {
        const db = firestore();
    
        db.collection('dogs').get().then(function(querySnapshot) {
            var batch = db.batch();
    
            querySnapshot.forEach(function(doc) {
                batch.delete(doc.ref);
            });
    
            return batch.commit();
      }).then(function() {
          console.log('batch delete all dogs completed')
      }); 
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
            {deleteAllModalIsVisible &&
            <DogDeleteModal
                callback={modalDeleteAllCallback}
            />
            }
            <h1>Dogs page</h1>
            <span style={{float:'center', color: 'red'}} onClick={handleDeleteAll}>delete all</span>
            <SimpleErrorMessage
                error={simpleErrorMsg}
            />
            <div
                className='dogCardContainer'
                style={
                    currentScreenWidth > 1066 ?
                        {}
                        :
                        currentScreenWidth > 533 ? 
                        { maxWidth: '533px', position: 'center' }
                        :
                        { justifyContent: 'center' }
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
