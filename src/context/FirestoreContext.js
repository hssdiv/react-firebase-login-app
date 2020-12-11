import React, { useReducer, useContext } from 'react'
import { FirebaseStorageContext } from './FirebaseStorageContext'
import { firestore } from '../config/firebase'
import { generateLocalRequestOptions } from '../util/LocalRequestOptions'

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

    const { storageMethods } = useContext(FirebaseStorageContext)

    const initialState = null;
    const [firestoreStatus, dispatch] = useReducer(reducer, initialState)

    const firestoreMethods = {
        addDogToFirestore: async (dogToAdd) => {
            if (process.env.REACT_APP_SERVER === "GOOGLE") {
                try {
                    const db = firestore();
                    db.collection('dogs').add(dogToAdd);
                    dispatch({ type: 'FIRESTORE_CREATE' })
                    return { result: true }
                } catch (error) {
                    dispatch({ type: 'FIRESTORE_ERROR', error: error.message })
                    return { result: false, errorMessage: error.message }
                }
            } else {
                try {
                    const requestOptions = generateLocalRequestOptions('POST', dogToAdd);
 
                    const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/savedog`, requestOptions)

                    console.log(response)
                    const result = await response.json();
                    if (response.ok) {
                        console.log('response from server:')
                        console.log(result)
                        dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                        return { result: true }
                    } else {
                        throw new Error(result);
                    }
                } catch (error) {
                    dispatch({ type: 'FIRESTORE_ERROR', error: error.message })
                    return { result: false, errorMessage: error.message }
                }
            }

        },
        updateDog: async (updatedDog, id) => {
            if (process.env.REACT_APP_SERVER === "GOOGLE") {
                const db = firestore();
                db.collection('dogs').doc(id).set(updatedDog);
            } else {
                const updatedDogWithId = { dog_id: id, ...updatedDog }
                console.log(JSON.stringify(updatedDogWithId))
                try {
                    const requestOptions = generateLocalRequestOptions('PATCH', updatedDogWithId);

                    const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/updatedog`, requestOptions)
                    const result = await response.json();

                    if (response.ok) {
                        console.log('response from server:')
                        console.log(result)
                        dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                    } else {
                        throw new Error(`error: ${result}`);
                    }
                } catch (error) {
                    dispatch({ type: 'FIRESTORE_ERROR', error: error.message })
                    console.log(error.message)
                }
            }
        },
        deleteDogFromFirestore: async (dogData) => {
            if (process.env.REACT_APP_SERVER === "GOOGLE") {
                const db = firestore();
                db.collection('dogs').doc(dogData.id).delete().then(function () {
                    console.log('Dog successfully deleted!');
                }).catch(function (error) {
                    console.error('Error removing dog: ', error);
                });
            } else {
                try {
                    const requestOptions = generateLocalRequestOptions('DELETE');

                    const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/deletedog?` + new URLSearchParams({
                        dog_id: dogData.id
                    }), requestOptions)
                    const result = await response.json();
                    
                    if (response.ok) {
                        console.log('response from server:')
                        console.log(result)
                        dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                    } else {
                        throw new Error(`error: ${result}`);
                    }
                } catch (error) {
                    dispatch({ type: 'FIRESTORE_ERROR', error: error.message })
                    console.log(error.message)
                }
            }
            if (dogData.custom) {
                storageMethods.deleteByUrl(dogData.imageUrl)
            }
        },
        deleteSelected: async (dogsChecked) => {
            if (process.env.REACT_APP_SERVER === "GOOGLE") {
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
            } else {
                try {
                    const dogs_ids = []
                    dogsChecked.filter(dog => dog.checked)
                        .map(dog => dogs_ids.push(dog.id.toString()))

                    // console.log(JSON.stringify({ dogs_ids: dogs_ids }))

                    const requestOptions = generateLocalRequestOptions('DELETE', { dogs_ids: dogs_ids });

                    const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/deleteselecteddogs`, requestOptions)
                    const result = await response.json();

                    if (response.ok) {    
                        console.log('response from server:')
                        console.log(result)
                        dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                    } else {
                        throw new Error(`error: ${result}`);
                    }
                } catch (error) {
                    dispatch({ type: 'FIRESTORE_ERROR', error: error.message })
                    console.log(error.message)
                }
            }
        },
        deleteAll: async () => {
            if (process.env.REACT_APP_SERVER === "GOOGLE") {
                const db = firestore();

                db.collection('dogs').get().then(function (querySnapshot) {
                    var batch = db.batch();

                    querySnapshot.forEach(function (doc) {
                        batch.delete(doc.ref);
                        storageMethods.deleteByUrl(doc.data().imageUrl)
                    });
                    dispatch({ type: 'FIRESTORE_BATCH_DELETE' })
                    return batch.commit();
                }).then(function () {
                    console.log('batch delete dog(s) completed')
                });
            } else {
                try {
                    const requestOptions = generateLocalRequestOptions('DELETE');

                    const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/deletedogs`, requestOptions)
                    const result = await response.json();

                    if (response.ok) {
                        console.log('response from server:')
                        console.log(result)
                        dispatch({ type: 'UPDATE_DOGS_FROM_LOCAL_SERVER' })
                    } else {
                        throw new Error(`error: ${result}`);
                    }
                } catch (error) {
                    dispatch({ type: 'FIRESTORE_ERROR', error: error.message })
                    console.log(error.message)
                }
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