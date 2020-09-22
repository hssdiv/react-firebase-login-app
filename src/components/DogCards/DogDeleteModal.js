import React from 'react'
import '../../styles/ModalDeleteConfirm.css'
import useEscape from '../../ui/useEscape'
import useEnter from '../../ui/useEnter'

export function DogDeleteModal({ callback, title, text, type }) {

    const handleCancelButton = () => {
        callback('MODAL_CLOSED');
    }

    useEscape(handleCancelButton);

    const handleDeleteButton = () => {
        callback(type);
    }

    useEnter(handleDeleteButton);

    const handleCloseModal = () => {
        callback('MODAL_CLOSED');
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
                className='modalContent'>
                <div
                    className='modalContainer'
                >
                    <h1>{title}</h1>
                    <p>{text}</p>

                    <div className='modalClearfix' >
                        <button
                            className='modalCancelbtn'
                            type='button'
                            onClick={handleCancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            className='modalDeletebtn'
                            type='button'
                            onClick={handleDeleteButton}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}