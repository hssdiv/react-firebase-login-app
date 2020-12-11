import React, { useReducer } from 'react'
import auth, { storage, firestore } from '../config/firebase'
import { UniqueIdGenerator } from './../util/UniqueIdGenerator'
import { generateLocalRequestOptions } from '../util/LocalRequestOptions'

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
                if (process.env.REACT_APP_SERVER === 'GOOGLE') {
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

                            async function uploadCustomDogToFirestore(result, fileUrl) {
                                const addCustomdDog = { breed: result.breed, subBreed: result.subBreed, imageUrl: fileUrl, custom: true }

                                const db = firestore();
                                db.collection('dogs').add(addCustomdDog);
                            }
                        });

                    return true
                } else {
                    const addCustomdDog = { breed: result.breed, subBreed: result.subBreed, custom: true }

                    function getBase64(file) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            console.log();
                            sendCustomDogToServer(reader.result)
                        };
                        reader.onerror = function (error) {
                            console.log('Error: ', error);
                        };
                    }
                    getBase64(result.dogPicture)

                    async function sendCustomDogToServer(picture) {
                        //data:image/jpeg;base64,/9j/4AAQSkZJRg
                        const customDog = {...addCustomdDog, picture: picture}

                        const requestOptions = generateLocalRequestOptions('POST', customDog);

                        const response = await fetch('http://localhost:4000/savedog', requestOptions)
                        if (response) {
                            const result = await response.json();
                            console.log('response from server:')
                            console.log(result)
                        } else {
                            throw new Error('response from server is null');
                        }
                        dispatch({ type: 'DOG_PICTURE_UPLOADED' })
                        return true
                    }


                }
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