import React, { useState } from 'react'
import '../../styles/ModalEdit.css'
import SimpleErrorMessage from '../SimpleErrorMessage'
import useEscape from '../../ui/useEscape'
import useEnter from '../../ui/useEnter'

export function DogEditModal({dogData, callback}) {
    const [breed, setBreed] = useState(dogData.breed);
    const [subBreed, setSubBreed] = useState(dogData.subBreed ? dogData.subBreed : '');
    const [error, setError] = useState(null);

    const handleCancelButton = () => {
        setError(null);
        callback({ action: 'MODAL_CLOSED' });
    }

    useEscape(handleCancelButton);

    const handleConfirmButton = (event) => {
        if (breed === '') {
            setError('You must type in breed');
        } else {
            setError(null);
            if (event) {
                event.preventDefault();
            }
            callback({ action: 'MODAL_CONFIRM_PRESSED', breed: breed, subBreed: subBreed });
        }
    }

    useEnter(handleConfirmButton);

    const handleCloseModal = () => {
        callback({ action: 'MODAL_CLOSED' });
    }

    const errorCallback = (result) => {
        setError(result);
    }

    return (
        <div
            className='modalConfirm'
        >
            <span
                onClick={handleCloseModal}
                className='modalClose'
                title='Close Modal'
            >
                ×
            </span>
            <form
                onSubmit={handleConfirmButton}
                className='modalContent'>
                <div className='modalContainer'>
                    <h1>Edit Dog</h1>
                    <p>Change dog data</p>
                    <SimpleErrorMessage
                        callback={errorCallback}
                        error={error}
                    />
                    <label className='inputLabel'>
                        Breed:
                    </label>
                    <input
                        className='dogInput'
                        type='text'
                        value={breed}
                        onChange={newValue => setBreed(newValue.target.value)}
                        name='dogsBreed'
                    />
                    <label
                        className='inputLabel'
                    >
                        Sub-breed:
                    </label>
                    <input
                        className='dogInput'
                        type='text'
                        value={subBreed}
                        onChange={newValue => setSubBreed(newValue.target.value)}
                        name='dogsSubBreed' />
                    <div
                        className='modalClearfix'
                    >
                        <button
                            className='modalConfirmButton'
                            type='button'
                            onClick={handleConfirmButton}
                        >
                            Confirm
                        </button>
                        <button
                            className='modalCancelButton'
                            type='button'
                            onClick={handleCancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}