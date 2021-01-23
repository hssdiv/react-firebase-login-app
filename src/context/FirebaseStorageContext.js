import React, { useReducer } from 'react'
//import { UniqueIdGenerator } from './../util/UniqueIdGenerator'
import ServerDogApi from '../api/ServerDogApi'
import { toBase64, createChunksFromBase64 } from '../util'

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'DOG_PICTURE_UPLOADED':
            console.log('storage reducer: DOG_PICTURE_UPLOADED')
            return {
                ...prevState,
                status: 'UPLOADED'
            }
        case 'DOG_PICTURE_DELETED':
            console.log('storage reducer: DOG_PICTURE_DELETED')
            return {
                ...prevState,
                status: 'DELETED'
            }
        case 'FIREBASE_STORAGE_ERROR':
            console.log('storage reducer: firebase storage error')
            return {
                ...prevState,
                status: 'ERROR',
                errorMessage: action.errorMessage
            }
        case 'UPDATE_PROGRESS_BAR':
            //console.log('storage reducer: UPDATE_PROGRESS_BAR')
            const newPosition = prevState.position + 1;
            return {
                ...prevState,
                status: 'PROGRESS',
                position: newPosition,
                percentage: action.percentage
            }
        case 'INITIAL':
            console.log('storage reducer: INITIAL')
            return {
                ...prevState,
                status: 'INITIAL',
                dog: action.dog,
                name: action.name,
                position: action.position,
                chunks: action.chunks,
            }
        case 'CLEAR_STATE':
            console.log('storage reducer: CLEAR_STATE')
            return {
                ...prevState,
                status: 'CLEAR_STATE',
                pausedDog: {},
                pausedPosition: -1,
                pausedChunks: [],
                paused: false,
                canceled: false,
            }
        case 'PAUSE_UPLOAD':
            console.log('storage reducer: PAUSE_UPLOAD')
            return {
                ...prevState,
                status: 'PAUSE_UPLOAD',
                paused: true,
            }
        case 'RESUME':
            console.log('storage reduced: RESUME');
            return {
                ...prevState,
                status: 'RESUME',
                paused: false,
            }
        case 'CANCEL_UPLOAD':
            console.log('storage reducer: CANCEL_UPLOAD')
            return {
                ...prevState,
                status: 'CANCEL_UPLOAD',
                canceled: true,
            }
        case 'FINAL':
            console.log('storage reducer: FINAL')
            return {
                ...prevState,
                status: 'FINAL',
            }
        default:
            return prevState
    }
}

export const FirebaseStorageContext = React.createContext();

export function FirebaseStorageProvider({ children }) {
    const initialState = {
        paused: false,
        canceled: false,
        dog: {},
        name: '',
        position: -1,
        chunks: [],
        percentage: 0,
    };
    const [storageStatus, dispatch] = useReducer(reducer, initialState)

    const storageMethods = {
        uploadPictureInitial: async (data) => {
            try {
                const addCustomdDog = {
                    breed: data.breed,
                    subBreed: data.subBreed,
                    custom: true,
                }
                const customDog = {
                    ...addCustomdDog,
                    picture: data.dogPicture
                }

                console.log(customDog)

                const name = customDog.picture.name; // use uniqueIdGen?
                const base64file = await toBase64(data.dogPicture);
                const resultInitial = await ServerDogApi.saveDogCustomInitial(name, base64file)
                
                if (!resultInitial.successful) {
                    throw new Error(resultInitial.errorMessage);
                }
                const chunks = createChunksFromBase64(resultInitial.base64file);

                dispatch({ type: 'INITIAL', dog: customDog, position: 0, chunks, name });
            } catch (error) {
                console.log(error);
                return { result: false, errorMessage: error.message }
            }
        },
        uploadPictureChunk: async (name, chunk) => {
            try {
                    //console.log(`position is: ${storageStatus.position}`);
                    const resultChunk = await ServerDogApi.saveDogCustomChunk(name, chunk);
                    if (!resultChunk.successful) {
                        throw new Error(resultChunk.errorMessage);
                    }
                    
                    console.log(`progress: ${resultChunk.result}`)

                    dispatch({
                        type: 'UPDATE_PROGRESS_BAR',
                        percentage: resultChunk.result
                    });
                    if (storageStatus.chunks.length === storageStatus.position + 1) {
                        console.log(`chunks length ${storageStatus.chunks.length}`)
                        console.log('dispatching final')
                        dispatch({
                            type: 'FINAL',
                        });
                    }
                } catch (error) {
                    console.log(error);
                    return { result: false, errorMessage: error.message }
                }
            },
            uploadPictureFinal: async (customDog) => {
                try {
                const resultFinal = await ServerDogApi.saveDogCustomFinal(customDog)

                if (resultFinal.successful) {
                    dispatch({ type: 'CLEAR_STATE' })
                    dispatch({ type: 'DOG_PICTURE_UPLOADED' })
                } else {
                    dispatch({ type: 'FIREBASE_STORAGE_ERROR', errorMessage: resultFinal.errorMessage })
                }
            } catch (error) {
                console.log(error);
                return { result: false, errorMessage: error.message }
            }
        },
        clearUploadState: () => {
            dispatch({ type: 'CLEAR_STATE' });
        },
        pausePictureUpload: () => {
            dispatch({ type: 'PAUSE_UPLOAD' });
        },
        cancelPictureUpload: () => {
            dispatch({ type: 'CANCEL_UPLOAD' });
        },
        resumePictureUpload: async () => {
            dispatch({ type: 'RESUME' });
        },
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