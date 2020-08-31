import React from 'react'
import '../styles/ModalDeleteConfirm.css'
import useEscape from '../ui/useEscape'
import useEnter from '../ui/useEnter'

function DogDeleteModal(props) {

    const handleCancelButton = () => {
        props.callback('MODAL_CLOSED');
    }

    useEscape(handleCancelButton);

    const handleDeleteButton = () => {
        props.callback('MODAL_DELETE_PRESSED');
    }

    useEnter(handleDeleteButton);

    const handleCloseModal = () => {
        props.callback('MODAL_CLOSED');
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
                    <p>Are you sure you want to delete dog?</p>

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

export default DogDeleteModal
