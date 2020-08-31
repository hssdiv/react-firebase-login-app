import React from 'react'
import '../styles/Dog.css'
import DogDeleteModal from './DogDeleteModal'
import DogEditModal from './DogEditModal'
import Spinner from './Spinner'
import { firestore } from '../config/firebase'

function Dog(props) {
    const [deletionModalIsVisible, setDeletionModalIsVisible] = React.useState(false);
    const [editModalIsVisible, setEditModalIsVisible] = React.useState(false);

    const [spinnerIsVisible, setSpinnerIsVisible] = React.useState(false);

    const handleDeleteDogButton = () => {
        setDeletionModalIsVisible(true);
    }

    const handleEditDogButton = () => {
        setEditModalIsVisible(true);
    }

    const modalDeleteCallback = (result) => {
        switch (result) {
            case 'MODAL_CLOSED':
                setDeletionModalIsVisible(false);
                break;
            case 'MODAL_DELETE_PRESSED':
                setSpinnerIsVisible(true);
                setDeletionModalIsVisible(false);

                const deleteDogFromFb = async () => {
                    const db = firestore();
                    await db.collection('dogs').doc(props.dogData.id).delete().then(function () {
                        console.log('Dog successfully deleted!');
                    }).catch(function (error) {
                        console.error('Error removing dog: ', error);
                    });
                }
                setTimeout(deleteDogFromFb, 1000);

                break;
            default:
                return;
        }
    }

    const modalEditCallback = (result) => {
        switch (result.action) {
            case 'MODAL_CLOSED':
                setEditModalIsVisible(false);
                break;
            case 'MODAL_CONFIRM_PRESSED':
                setEditModalIsVisible(false);

                const db = firestore();
                const updatedDog = { breed: result.breed, subBreed: result.subBreed, imageUrl: props.dogData.imageUrl }
                db.collection('dogs').doc(props.dogData.id).set(updatedDog);
                break;
            default:
                return;
        }
    }

    return (
        <>
            {deletionModalIsVisible &&
                <DogDeleteModal
                    callback={modalDeleteCallback}
                />
            }
            {editModalIsVisible &&
                <DogEditModal
                    dogData={props.dogData}
                    callback={modalEditCallback}
                />
            }
            <div
                className='dogCard'
                style={
                    { position: 'relative' }
                }
            >
                <div
                    className='dogImage'
                    style={
                        { backgroundImage: 'url(' + props.dogData.imageUrl + ')' }
                    }
                />
                <span
                    className='dogEditButton'
                    onClick={handleEditDogButton}
                >
                    &#9998;
                </span>
                <span
                    className='dogDeleteButton'
                    onClick={handleDeleteDogButton}
                >
                    &#10006;
                </span>
                <div
                    className='dogCardText'>
                    {props.dogData && props.dogData.breed &&
                        <div>
                            breed: {props.dogData.breed}
                        </div>}
                    {props.dogData && props.dogData.subBreed &&
                        <div>
                            sub-breed: {props.dogData.subBreed}
                        </div>
                    }
                </div>
                {spinnerIsVisible &&
                    <Spinner
                        style={
                            {
                                position: 'relative',
                                top: '125px',
                                left: '125px'
                            }
                        }
                    />
                }
            </div>
        </>
    )
}

export default Dog