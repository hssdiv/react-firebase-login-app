import React, { useState, useEffect, useContext } from 'react'
import { Dog, AddDogCard, DogDeleteModal } from '../DogCards'
import GetWidth from '../../ui/useWindowSize'
import { firestore } from '../../config/firebase'
import Spinner from '../Spinner'
import SimpleErrorMessage from '../SimpleErrorMessage'
import { DogsContext, FirebaseStorageContext, FirestoreContext } from '../../context/'
import './../../styles/Dogs.css'
import { DogAddModal } from '../DogCards/DogAddModal'
import DogApi from '../../api/ExpressDogApi'

export function Dogs() {
    const currentScreenWidth = GetWidth()

    const [Dogs, setDogs] = useState(null)
    const [dogsChecked, setDogsChecked] = useState(null)

    const [randomDog, setRandomDog] = useState({})

    const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false)
    const [deleteAllModalIsVisible, setDeleteAllModalIsVisible] = useState(false)
    const [dogAddModalVisible, setDogAddModalVisible] = useState(false)
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)
    const [dogSpinnerIsVisible] = useState(false)
    const [deleteCheckedEnabled, setDeleteCheckedEnabled] = useState(false)

    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null)

    const { dogResult, dogMethods } = useContext(DogsContext)
    const { storageStatus, storageMethods } = useContext(FirebaseStorageContext)
    const { firestoreStatus, firestoreMethods } = useContext(FirestoreContext)

    useEffect(() => {
        console.log('useEffect fetching Dogs from fs...')
        if (process.env.REACT_APP_SERVER === "GOOGLE") {
            const db = firestore();
            const dogListenerUnsubscribe = db.collection('dogs').onSnapshot((snapshot) => {
                const dogsData = [];
                snapshot.forEach(doc => dogsData.push(({ id: doc.id, ...doc.data() })))
                setDogs(dogsData);
            })
            return dogListenerUnsubscribe
        } else {
            getDogsFromLocalServer()
        }
    }, [])

    const getDogsFromLocalServer = async () => {
        console.log('getting dogs from server')
        const result = await DogApi.getDogs()
        if (result.successful) {
            setDogs(result.dogsData);
        } else {
            setSimpleErrorMsg(result.errorMessage)
        }
    }

    useEffect(() => {
        if (storageStatus) {
            switch (storageStatus.status) {
                case 'ERROR':
                    setSimpleErrorMsg(storageStatus.errorMessage)
                    break
                case 'UPLOADED':
                    getDogsFromLocalServer();
                    break;
                default:
                    break
            }
        }
        if (firestoreStatus) {
            switch (firestoreStatus.status) {
                case 'ERROR':
                    setSimpleErrorMsg(firestoreStatus.errorMessage)
                    break
                case 'UPDATE_DOGS_FROM_LOCAL_SERVER':
                    getDogsFromLocalServer();
                    break;
                default:
                    break
            }
        }
    }, [storageStatus, firestoreStatus])

    useEffect(() => {
        if (dogResult) {
            setRandomDog(dogResult)
        }
    }, [dogResult])

    useEffect(() => {
        console.log('detected changes to Dogs list:');
        if (Dogs) {
            console.log('Dogs size: ' + Dogs.length);
            console.log(Dogs);
            if (dogsChecked) {

                const dogsMerged = Dogs.map(dog => {
                    const vauDog = dogsChecked.find(checkedDog => checkedDog.id === dog.id)

                    if (vauDog) {
                        return { ...vauDog, ...Dogs.find(dog => dog.id === vauDog.id) }
                    } else {
                        return dog
                    }
                });

                setDogsChecked(dogsMerged);
                console.log('dogsMerged')
                console.log(dogsMerged);
            } else {
                const newDogsChecked = Dogs.map(dog => ({ ...dog, checked: false }))
                setDogsChecked(newDogsChecked);
                console.log('newDogsChecked')
                console.log(newDogsChecked);
            }

        }
        // eslint-disable-next-line
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

    const handleAddDogOnClick = () => {
        setDogAddModalVisible(true);
    }

    const handleDeleteButton = () => {
        setDeleteModalIsVisible(true)
    }

    const handleDeleteAllButton = () => {
        setDeleteAllModalIsVisible(true)
    }

    const modalDeleteCallback = (result) => {
        switch (result) {
            case 'MODAL_CLOSED':
                setDeleteModalIsVisible(false);
                break;
            case 'MODAL_DELETE_CHECKED_PRESSED':
                setDeleteModalIsVisible(false);
                firestoreMethods.deleteSelected(dogsChecked)
                break;
            case 'MODAL_DELETE_ALL_PRESSED':
                setDeleteAllModalIsVisible(false);
                firestoreMethods.deleteAll()
                break;
            default:
                return;
        }
    }


    useEffect(() => {
        console.log('Getting random dog...')
        if ((randomDog.message) && (randomDog.message.includes('breeds'))) {
            const breedName = getFullBreedName(randomDog.message)

            if (breedName.includes('-')) {
                const [masterBreed, subBreed] = breedName.split('-')
                const dog = { breed: masterBreed, subBreed: subBreed, imageUrl: randomDog.message }
                console.log('adding dog' + dog.breed + 'to firestore')

                firestoreMethods.addDogToFirestore(dog)
            } else {
                const dog = { breed: breedName, imageUrl: randomDog.message }
                console.log('adding dog ' + dog.breed + ' to firestore')
                firestoreMethods.addDogToFirestore(dog)
            }

            setSpinnerIsVisible(false)
        } else if (randomDog.error) {
            setSimpleErrorMsg(randomDog.error)
            setSpinnerIsVisible(false)
        }
        // eslint-disable-next-line
    }, [randomDog])

    function getFullBreedName(url) {
        const position = url.indexOf('breeds');
        const BREED_AND_SLASH_LENGTH = 7;
        const start = position + BREED_AND_SLASH_LENGTH;
        const end = url.indexOf('/', start)
        return url.substring(start, end)
    }

    const addModalCallback = async (result) => {
        setDogAddModalVisible(false);
        switch (result.action) {
            case 'MODAL_CLOSED':
                setDogAddModalVisible(false);
                setDeleteAllModalIsVisible(false);
                break;
            case 'MODAL_CONFIRM_PRESSED':
                if (result.type === 'RANDOM') {
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
                } else {
                    storageMethods.uploadPicture(result)
                }
                break;
            default:
                return;
        }
    }

    return (
        <div>
            {deleteModalIsVisible &&
                <DogDeleteModal
                    callback={modalDeleteCallback}
                    title='Delete dog(s)'
                    text='Are you sure you want to delete dog(s)?'
                    type='MODAL_DELETE_CHECKED_PRESSED'
                />
            }
            {deleteAllModalIsVisible &&
                <DogDeleteModal
                    callback={modalDeleteCallback}
                    title='Delete all dogs'
                    text='Are you sure you want to delete all dogs?'
                    type='MODAL_DELETE_ALL_PRESSED'
                />}
            {dogAddModalVisible &&
                <DogAddModal callback={addModalCallback} />}
            <h1>
                Dogs page
            </h1>
            <div>
                {deleteCheckedEnabled ?
                    <span className='deleteDogsButton' onClick={handleDeleteButton}>Delete selected</span>
                    :
                    <span className='deleteDogsButton' disabled style={{ opacity: '0.5' }}>Delete selected</span>
                }
                <span className='deleteAllDogsButton' onClick={handleDeleteAllButton}>Delete all</span>
            </div>

            <SimpleErrorMessage
                error={simpleErrorMsg}
            />
            <div
                className='dogCardContainer'
                style={
                    currentScreenWidth > 1079 ?
                        {}
                        :
                        currentScreenWidth > 547 ?
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
