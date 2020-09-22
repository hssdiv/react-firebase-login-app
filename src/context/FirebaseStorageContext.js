import React, { useReducer } from 'react'
import auth, { storage, firestore } from '../config/firebase'
import { UniqueIdGenerator } from './../util/UniqueIdGenerator'

const reducer = (state, action) => {
    switch (action.type) {
        case 'DOG_PICTURE_UPLOADED':
            console.log('storage reducer: DOG_PICTURE_UPLOADED')
            return state = { status: 'UPLOADED' }
        case 'DOG_PICTURE_DELETED':
            console.log('storage reducer: DOG_PICTURE_DELETED')
            return state = { status: 'DELETED' }
        case 'FIREBASE_STORAGE_ERROR':
            console.log('storage reducer: firebase storage error')
            return state = { status: 'ERROR', errorMessage: action.errorMessage }
        case 'UPDATE_PROGRESS_BAR':
            return state = { status: 'PROGRESS', percentage: action.percentage }
        default:
            return state
    }
}

export const FirebaseStorageContext = React.createContext();

export function FirebaseStorageProvider({ children }) {
    const initialState = null;
    const [storageStatus, dispatch] = useReducer(reducer, initialState)

    const storageMethods = {
        uploadPicture: async (result) => {
            try {
                const storageRef = storage.ref();

                const uniqueGeneratedName = UniqueIdGenerator();

                const fileRef = storageRef.child(auth.currentUser.uid).child(uniqueGeneratedName);
                var task = fileRef.put(result.dogPicture);

                task.on('state_changed',
                    function progress(snapshot) {
                        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('uploaded ' + percentage + '%');
                        dispatch({ type: 'UPDATE_PROGRESS_BAR', percentage: percentage })
                        //progressRef.current.value = percentage;
                    },

                    function error(err) {
                        console.error('upload progress error:' + err)

                        dispatch({ type: 'FIREBASE_STORAGE_ERROR', errorMessage: err })
                    },

                    async function complete() {
                        console.log('upload complete');

                        const fileUrl = await fileRef.getDownloadURL()

                        uploadCustomDogToFirestore(result, fileUrl);
                        
                        dispatch({ type: 'DOG_PICTURE_UPLOADED' })

                        function uploadCustomDogToFirestore(result, fileUrl) {
                            const db = firestore();
                            const addCustomdDog = { breed: result.breed, subBreed: result.subBreed, imageUrl: fileUrl }
                            db.collection('dogs').add(addCustomdDog);
                        }
                    });

                return { result: true }
            } catch (error) {
                return { result: false, errorMessage: error.message }
            }
        },
        deleteByUrl: async (url) => {
            try {
                const imageRef = storage.refFromURL(url)
                await imageRef.delete();
                dispatch({ type: 'DOG_PICTURE_DELETED' })
                return { result: true }
            } catch (error) {
                //dispatch({ type: 'FIREBASE_STORAGE_ERROR', errorMessage: error.message})
                //console.log(error.message)
                return { result: false, errorMessage: error.message }
            }
        }
    }

    return (
        <FirebaseStorageContext.Provider
            value={{
                storageStatus,
                storageMethods
            }}
        >
            {children}
        </FirebaseStorageContext.Provider>
    );
}