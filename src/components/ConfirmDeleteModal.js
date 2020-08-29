import React from 'react'
import '../styles/ModalConfirm.css'

function ConfirmDeleteModal(props) {

    const handleCancelButton = () => {
        props.callback('MODAL_CLOSED')
    }

    const handleDeleteButton = () => {
        props.callback('MODAL_DELETE_PRESSED')
    }

    const handleCloseModal = () => {
        props.callback('MODAL_CLOSED')
    }

    return (
        <div className='modalConfirm'>
            <span
                onClick={handleCloseModal}
                className='modalClose'
                title="Close Modal"
            >
                ×
            </span>
            <form className="modalContent">
                <div className="modalContainer">
                    <h1>Delete Dogo</h1>
                    <p>Are you sure you want to delete dogo?</p>

                    <div className="modalClearfix" >
                        <button
                            className='modalCancelbtn'
                            type="button"
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

export default ConfirmDeleteModal
