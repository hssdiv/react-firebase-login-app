import React, { useReducer, useContext } from 'react'
import { FirebaseStorageContext } from './FirebaseStorageContext'
import { firestore } from '../config/firebase'

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
            console.log('firestore reducer: firebase storage error')
            return state = { status: 'ERROR', errorMessage: action.errorMessage }
        default:
            return state
    }
}

export const FirestoreContext = React.createContext();

export function FirestoreProvider({ children }) {

    const { storageMethods } = useContext(FirebaseStorageContext)

    const initialState = null;
    const [firestoreStatus, dispatch] = useReducer(reducer, initialState)

    const firestoreMethods = {
        addDogToFirestore: async (dogToAdd) => {
            try {
                const db = firestore();
                db.collection('dogs').add(dogToAdd);
                dispatch({ type: 'FIRESTORE_CREATE' })
                return { result: true }
            } catch (error) {
                dispatch({ type: 'FIRESTORE_ERROR', error: error.message })
                return { result: false, errorMessage: error.message }
            }
        },
        deleteDogFromFirestore: (dogData) => {
            const db = firestore();
            db.collection('dogs').doc(dogData.id).delete().then(function () {
                console.log('Dog successfully deleted!');
            }).catch(function (error) {
                console.error('Error removing dog: ', error);
            });

            storageMethods.deleteByUrl(dogData.imageUrl)
        }
        ,
        deleteSelected: (dogsChecked) => {
            const db = firestore();

            db.collection('dogs').get().then(function (querySnapshot) {
                var batch = db.batch();

                querySnapshot.forEach(function (doc) {
                    if (dogsChecked.find(checkedDog => ((doc.id === checkedDog.id))).checked) {
                        batch.delete(doc.ref);

                        storageMethods.deleteByUrl(doc.data().imageUrl)
                    }
                });
                dispatch({ type: 'FIRESTORE_BATCH_DELETE' })
                return batch.commit();
            }).then(function () {
                console.log('batch delete dog(s) completed')
            });
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