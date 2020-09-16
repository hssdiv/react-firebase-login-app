import React, { useState } from 'react'
import '../../styles/Dog.css'
import { DogDeleteModal, DogEditModal } from './'
import Spinner from '../Spinner'
import { firestore, storage } from '../../config/firebase'

export function Dog({ dogData, handleChecked }) {
    const [deletionModalIsVisible, setDeletionModalIsVisible] = useState(false);
    const [editModalIsVisible, setEditModalIsVisible] = useState(false);
    const [deleteCheckBoxChecked, setDeleteCheckBoxChecked] = useState(dogData.checked);

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    const handleDeleteDogButton = () => {
        setDeletionModalIsVisible(true);
    }

    const handleEditDogButton = () => {
        setEditModalIsVisible(true);
    }

    const handleDeleteCheckBox = () => {
        handleChecked(dogData.id, !deleteCheckBoxChecked)
        setDeleteCheckBoxChecked(!deleteCheckBoxChecked)
    }

    const modalDeleteCallback = (result) => {
        switch (result) {
            case 'MODAL_CLOSED':
                setDeletionModalIsVisible(false);
                break;
            case 'MODAL_DELETE_PRESSED':
                setSpinnerIsVisible(true);
                setDeletionModalIsVisible(false);

                const deleteDogFromFb = () => {
                    const db = firestore();
                    db.collection('dogs').doc(dogData.id).delete().then(function () {
                        console.log('Dog successfully deleted!');
                    }).catch(function (error) {
                        console.error('Error removing dog: ', error);
                    });

                    //change 
                    const imageRef = storage.refFromURL(dogData.imageUrl)
                    imageRef.delete();
                }
                deleteDogFromFb();

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
                const updatedDog = { breed: result.breed, subBreed: result.subBreed, imageUrl: dogData.imageUrl }
                db.collection('dogs').doc(dogData.id).set(updatedDog);
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
                    dogData={dogData}
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
                        { backgroundImage: 'url(' + dogData.imageUrl + ')' }
                    }
                />
                {deleteCheckBoxChecked ?
                <span
                    className='dogDeleteCheckBox'
                    style={{color: 'green', opacity: '1'}}
                    onClick={handleDeleteCheckBox}
                >
                    &#9745;
                </span>
                :
                <span
                    className='dogDeleteCheckBox'
                    onClick={handleDeleteCheckBox}
                >
                    &#9744;
                </span>
                }
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
                    {dogData && dogData.breed &&
                        <div>
                            breed: {dogData.breed}
                        </div>}
                    {dogData && dogData.subBreed &&
                        <div>
                            sub-breed: {dogData.subBreed}
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