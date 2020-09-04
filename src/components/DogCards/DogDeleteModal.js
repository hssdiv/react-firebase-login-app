import React from 'react'
import '../../styles/ModalDeleteConfirm.css'
import useEscape from '../../ui/useEscape'
import useEnter from '../../ui/useEnter'

export function DogDeleteModal({callback}) {

    const handleCancelButton = () => {
        callback('MODAL_CLOSED');
    }

    useEscape(handleCancelButton);

    const handleDeleteButton = () => {
        callback('MODAL_DELETE_PRESSED');
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
                    <h1>Delete Dog</h1>
                    <p>Are you sure you want to delete dog(s)?</p>

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