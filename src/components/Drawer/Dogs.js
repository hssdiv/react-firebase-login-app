import React, { useState, useEffect, useContext } from 'react'
import { Dog, AddDogCard, DogDeleteModal } from '../DogCards/'
import GetWidth from '../../ui/useWindowSize'
import { firestore } from '../../config/firebase'
import Spinner from '../Spinner'
import SimpleErrorMessage from '../SimpleErrorMessage'
import { DogsContext } from '../../context/DogsContext'
import './../../styles/Dogs.css'

export function Dogs() {
    const currentScreenWidth = GetWidth()

    const [Dogs, setDogs] = useState(null)
    const [dogsChecked, setDogsChecked] = useState(null)

    const [randomDog, setRandomDog] = useState({})

    const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false)
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)
    const [dogSpinnerIsVisible] = useState(false)
    const [deleteCheckedEnabled, setDeleteCheckedEnabled] = useState(false)

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
            console.log(Dogs);
            if (dogsChecked) {

                const dogsMerged = Dogs.map(dog => {
                    const vauDog = dogsChecked.find(checkedDog => checkedDog.id === dog.id)

                    if (vauDog) {
                        return {...vauDog, ...Dogs.find(dog => dog.id === vauDog.id)}
                    } else {
                        return dog
                    }
                });

                setDogsChecked(dogsMerged);
                console.log('dogsMerged')
                console.log(dogsMerged);
            } else {
                const newDogsChecked = Dogs.map(dog => ({...dog, checked: false}))
                setDogsChecked(newDogsChecked);
                console.log('newDogsChecked')
                console.log(newDogsChecked);
            }
            
        }
    }, [Dogs])

    const handleChecked = (id, isChecked) => {
        const checkedDog = dogsChecked.find(dog => dog.id === id);
        checkedDog.checked = isChecked;
        const dogsWithCheckedDog = dogsChecked.map(dog => {
            if (dog.id === checkedDog.id) {
                return checkedDog;
            } else {
                return dog;
            }
        })
        setDogsChecked(dogsWithCheckedDog)
    }

    useEffect(() => {
        if ((dogsChecked) && (dogsChecked.find(checkedDog => checkedDog.checked === true))) {
            setDeleteCheckedEnabled(true);
        } else {
            setDeleteCheckedEnabled(false);
        }   
    }, [dogsChecked])

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

    const handleDeleteButton = () => {
        //TODO confirm modal
        setDeleteModalIsVisible(true)
    }

    const modalDeleteAllCallback = (result) => {
        switch (result) {
            case 'MODAL_CLOSED':
                setDeleteModalIsVisible(false);
                break;
            case 'MODAL_DELETE_PRESSED':
                //setSpinnerIsVisible(true);
                setDeleteModalIsVisible(false);

                deleteCollection();
                break;
            default:
                return;
        }
    }

    function deleteCollection() {
        const db = firestore();

        db.collection('dogs').get().then(function (querySnapshot) {
            var batch = db.batch();

            querySnapshot.forEach(function (doc) {
                if (dogsChecked.find(checkedDog => ((doc.id === checkedDog.id))).checked) {
                    batch.delete(doc.ref);
                }                
            });

            return batch.commit();
        }).then(function () {
            console.log('batch delete dog(s) completed')
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
                console.log('adding dog' + dog.breed + 'to firestore')

                addDogToFs(dog);
            } else {
                const dog = { breed: breedName, imageUrl: randomDog.message }
                console.log('adding dog ' + dog.breed + ' to firestore')
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
            {deleteModalIsVisible &&
                <DogDeleteModal
                    callback={modalDeleteAllCallback}
                />
            }
            <h1>Dogs page</h1>
            {deleteCheckedEnabled?   
            <button className='deleteDogsButton' onClick={handleDeleteButton}>delete</button>
            :
            <button className='deleteDogsButton' disabled style={{opacity: '0.7'}}>delete</button>
            }
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
                {dogsChecked &&
                    dogsChecked.map(dog => (
                        <Dog
                            key={dog.id}
                            dogData={dog}
                            handleChecked={handleChecked}
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
