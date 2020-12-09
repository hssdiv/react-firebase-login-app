import React, { useState, useRef } from 'react'
import '../../styles/ModalEdit.css'
import SimpleErrorMessage from '../SimpleErrorMessage'
import useEscape from '../../ui/useEscape'
import useEnter from '../../ui/useEnter'

export function DogAddModal({ callback }) {
    const [breed, setBreed] = useState(null);
    const [subBreed, setSubBreed] = useState(null);
    const [error, setError] = useState(null);
    const [dogPicture, setDogPicture] = useState(null);

    const [formEnabled, setFormEnabled] = useState(false);

    const imagePreviewRef = useRef(null)

    const [addType, setAddType] = useState('RANDOM');

    const handleCancelButton = () => {
        setError(null);
        callback({ action: 'MODAL_CLOSED' });
    }

    useEscape(handleCancelButton);

    const handleConfirmButton = (event) => {
            if (formEnabled) {
                if ((breed === null) || (breed === '')) {
                    setError('You must type in breed');
                } else if (dogPicture === null) {
                    setError('You must uplaod dog picture');
                }
                else {
                    setError(null);
                if (event) {
                    event.preventDefault();
                }
                callback({ action: 'MODAL_CONFIRM_PRESSED', type: addType, breed: breed, subBreed: subBreed, dogPicture: dogPicture });
                }
            }
            else {
                setError(null);
                if (event) {
                    event.preventDefault();
                }
                callback({ action: 'MODAL_CONFIRM_PRESSED', type: addType, breed: breed, subBreed: subBreed, dogPicture: dogPicture });
            }
    }

    useEnter(handleConfirmButton);

    const handleCloseModal = () => {
        callback({ action: 'MODAL_CLOSED' });
    }

    const errorCallback = (result) => {
        setError(result);
    }

    const handleCustomAddChange = (event) => {
        if (event.target.value === 'RANDOM') {
            setFormEnabled(false)
        } else {
            setFormEnabled(true)
        }
        setAddType(event.target.value)
    }

    const uploadFile = async ({ target: { files } }) => {
        console.log('dogAddModal files[0]:')
        console.log(files[0])

        if (files[0]) {
            setDogPicture(files[0]);

            const fr = new FileReader();
            fr.onload = function () {
                imagePreviewRef.current.src = fr.result;
            }
            fr.readAsDataURL(files[0]);
        }
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
                    <h1>Add Dog</h1>
                    <p>Add dog data</p>

                    <div className="radio">
                        <label>
                            <input type="radio" value="RANDOM"
                                checked={addType === 'RANDOM'}
                                onChange={handleCustomAddChange} />
                            Random dog
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="CUSTOM"
                                checked={addType === 'CUSTOM'}
                                onChange={handleCustomAddChange} />
                            Custom dog
                        </label>
                    </div>

                    <SimpleErrorMessage
                        callback={errorCallback}
                        error={error}
                    />

                    {formEnabled &&
                        <>
                            <label className='inputLabel'>
                                Breed:
                            </label>
                            <input
                                className='dogInput'
                                type='text'
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
                                onChange={newValue => setSubBreed(newValue.target.value)}
                                name='dogsSubBreed' />

                            <label className="dogInput">
                                {dogPicture &&
                                    <img
                                        alt='selected'
                                        ref={imagePreviewRef}
                                        style={{ width: '40px', height: '40px', paddingRight: '15px' }}
                                    />
                                }
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control profile-pic-uploader"
                                    onChange={uploadFile}
                                />
                            </label>
                        </>
                    }
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