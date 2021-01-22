import React, { useReducer } from 'react'
// import { FirebaseStorageContext } from './FirebaseStorageContext'
import ServerDogApi from '../api/ServerDogApi'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FIRESTORE_CREATE':
            console.log('firestore reducer: DOG_COLECTION_CREATED')
            return state = { status: 'CREATED' }
        case 'FIRESTORE_DELETE':
            console.log('firestore reducer: DOG_COLECTION_DELETED')
            return state = { status: 'DELETED' }
        case 'FIRESTORE_BATCH_DELETE':
            console.log('firestore reducer: BATCH_DELETED')
            return state = { status: 'BATCH_DELETED' }
        case 'FIRESTORE_UPDATE':
            console.log('firestore reducer: DOG_COLLECTION_UPDATED')
            return state = { status: 'UPDATED' }
        case 'FIRESTORE_ERROR':
            console.log(`firestore reducer: firebase storage error: ${action.error}`)
            return state = { status: 'ERROR', errorMessage: action.error }
        case 'UPDATE_DOGS_FROM_LOCAL_SERVER':
            console.log('reducer: UPDATE_DOGS_FROM_LOCAL_SERVER')
            return state = { status: 'UPDATE_DOGS_FROM_LOCAL_SERVER' }
        default:
            return state
    }
}

export const FirestoreContext = React.createContext();

export function FirestoreProvider({ children }) {

    // const { storageMethods } = useContext(FirebaseStorageContext)

    const initialState = null;
    const [firestoreStatus, dispatch] = useReducer(reducer, initialState)

    const firestoreMethods = {
        addDogToFirestore: async (dogToAdd) => {
            const result = await ServerDogApi.saveDog(dogToAdd)
            if (result.successful) {
                dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                return { result: true }
            } else {
                dispatch({ type: 'FIRESTORE_ERROR', error: result.errorMessage })
                return { result: false, errorMessage: result.errorMessage }
            }
        },
        updateDog: async (updatedDog, id) => {
            const updatedDogWithId = { id, ...updatedDog }
            console.log(JSON.stringify(updatedDogWithId))

            const result = await ServerDogApi.updateDog(updatedDogWithId)
            if (result.successful) {
                dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                return { result: true }
            } else {
                dispatch({ type: 'FIRESTORE_ERROR', error: result.errorMessage })
                return { result: false, errorMessage: result.errorMessage }
            }
        },
        deleteDogFromFirestore: async (dogData) => {
            const result = await ServerDogApi.deleteDog(dogData.id)
            if (result.successful) {
                dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                return { result: true }
            } else {
                dispatch({ type: 'FIRESTORE_ERROR', error: result.errorMessage })
                return { result: false, errorMessage: result.errorMessage }
            }
        },
        deleteSelected: async (dogsChecked) => {
            const dogs_ids = []
            dogsChecked.filter(dog => dog.checked)
                .map(dog => dogs_ids.push(dog.id.toString()))

            const result = await ServerDogApi.deleteSelectedDogs(dogs_ids)
            if (result.successful) {
                dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                return { result: true }
            } else {
                dispatch({ type: 'FIRESTORE_ERROR', error: result.errorMessage })
                return { result: false, errorMessage: result.errorMessage }
            }
        },
        deleteAll: async () => {
            const result = await ServerDogApi.deleteDogs()
            if (result.successful) {
                dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                return { result: true }
            } else {
                dispatch({ type: 'FIRESTORE_ERROR', error: result.errorMessage })
                return { result: false, errorMessage: result.errorMessage }
            }
        }
    }

    return (
        <FirestoreContext.Provider
            value={{
                firestoreStatus,
                firestoreMethods
            }}
        >
            {children}
        </FirestoreContext.Provider>
    );
}
