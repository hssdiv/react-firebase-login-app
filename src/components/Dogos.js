import React, { useState, useEffect } from 'react'
import Dogo from './Dogo'
import GetWidth from '../ui/useWindowSize'
import AddDogoCard from './AddDogoCard'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import { firestore } from '../config/firebase'
import { getRandomDogo } from '../api/DogApi'
import Spinner from './Spinner'
import SimpleErrorMessage from './SimpleErrorMessage'

export const DogosContext = React.createContext();

function Dogos() {
    const currentScreenWidth = GetWidth()

    const [Dogos, setDogos] = useState(null)

    const [randomDogo, setRandomDogo] = useState({})

    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [dogoIDForDelete, setDogoIDForDelete] = useState(null)

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)

    const db = firestore();


    useEffect(() => {
        console.log('useEffect fetchDogosFromFb...')

            //const data = await db.collection('dogos').get();
            //setDogos(data.docs.map(doc => ({ id: doc.id, ...doc.data() })))

            const dogoListenerUnsibscribe = db.collection('dogos').onSnapshot((snapshot) => {
                const dogosData = [];
                snapshot.forEach(doc => dogosData.push(({ id: doc.id, ...doc.data() }) ))
                setDogos(dogosData);
            })

            return dogoListenerUnsibscribe
    }, [])

    useEffect(() => {
        console.log('useEffect Dogos...')
        console.log(Dogos)
    }, [Dogos])



    const handleAddDogoOnClick = () => {
        setSpinnerIsVisible(true)
        //TODO show spinner
        getRandomDogo(setRandomDogo, setSpinnerIsVisible)


    }

    useEffect(() => {
        console.log('useEffect randomDogo...')
        if ((randomDogo.message) && (randomDogo.message.includes('breeds'))) {
            const breedName = getFullBreedName(randomDogo.message)

            const addDogoToFb = (dogoToAdd) => {
                db.collection('dogos').add(dogoToAdd);
            }

            if (breedName.includes('-')) {
                const [masterBreed, subBreed] = breedName.split('-')

                const dogo = { breed: masterBreed, subBreed: subBreed, imageUrl: randomDogo.message }
                console.log(dogo)

                addDogoToFb(dogo);

                //TODO add dogo in fb
                //setMyDogoBreed(masterBreed)
                //setMyDogoSubBreed(subBreed)   
            } else {
                const dogo = { breed: breedName, imageUrl: randomDogo.message }
                console.log(dogo)
                addDogoToFb(dogo);

                //TODO add dogo in fb
                //setMyDogoBreed(breedName)       
            }
        }
        setSpinnerIsVisible(false)

    }, [randomDogo])


    const modalDeleteCallback = (result) => {
        switch (result) {
            case 'MODAL_CLOSED':
                setShowConfirmDeleteModal(false);
                break;
            case 'MODAL_DELETE_PRESSED':
                setShowConfirmDeleteModal(false);

                const deleteDogoFromFb = async () => {
                    await db.collection('dogos').doc(dogoIDForDelete).delete().then(function () {
                        //TODO remove this dogo from dogos?
                        console.log("Document successfully deleted!");
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });
                }
                deleteDogoFromFb();
                break;
            default:
                return;
        }
    }

    const dogoCardCallback = (result) => {
        switch (result.action) {
            case 'DOGO_DELETE':
                setDogoIDForDelete(result.id)
                setShowConfirmDeleteModal(true)
                break;
            case 'DOGO_EDIT':
                alert('editing dogo! ' + result.id)
                //TODO edit modal
                break;
            default:
                return;
        }
    }





    function getFullBreedName(url) {
        const position = url.indexOf('breeds');
        const start = position + 7
        const end = url.indexOf('/', start)
        return url.substring(start, end)
    }

    return (
        <div>
            <h1>Dogos page</h1>
            <div
                className='dogoCardContainer'
                style={currentScreenWidth > 1066 ? {} : { maxWidth: '533px' }} >
                <AddDogoCard onClick={handleAddDogoOnClick} />
                <DogosContext.Provider value={dogoCardCallback}>
                    {Dogos &&
                        Dogos.map(dogo => (
                            <Dogo key={dogo.id} dogoData={dogo} />
                        ))}

                </DogosContext.Provider>
            </div>
            {showConfirmDeleteModal &&
                <ConfirmDeleteModal callback={modalDeleteCallback} />
            }
            {spinnerIsVisible &&
                <Spinner />
            }
        </div>
    )
}

export default Dogos
