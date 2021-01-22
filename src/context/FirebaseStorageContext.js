import React, { useReducer } from 'react'
//import { UniqueIdGenerator } from './../util/UniqueIdGenerator'
import ServerDogApi from '../api/ServerDogApi'
import { toBase64, createChunksFromBase64 } from '../util'

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
            return state = {
                status: 'ERROR',
                errorMessage: action.errorMessage
            }
        case 'UPDATE_PROGRESS_BAR':
            return state = {
                status: 'PROGRESS',
                percentage: action.percentage
            }
        case 'PAUSE_UPLOAD_DATA':
            return state = {
                pausedDog: action.pausedDog,
                pausedPosition: action.pausedPosition,
                pausedChunks: action.pausedChunks,
            }
        case 'CLEAR_PAUSE_DATA':
            return state = {
                pausedDog: {},
                pausedPosition: -1,
                pausedChunks: [],
                paused: false,
                canceled: false,
            }
        case 'PAUSE_UPLOAD':
            return state = {
                paused: true,
            }
        case 'CANCEL_UPLOAD':
            return state = {
                canceled: true,
            }
        default:
            return state
    }
}

export const FirebaseStorageContext = React.createContext();

export function FirebaseStorageProvider({ children }) {
    const initialState = {
        paused: false,
        canceled: false,
        pausedDog: {},
        pausedPosition: -1,
        pausedChunks: [],
        percentage: 0,
    };
    const [storageStatus, dispatch] = useReducer(reducer, initialState)

    const storageMethods = {
        uploadPicture: async (result) => {
            const data = result
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
                //check initial?
                if (!resultInitial.successful) {
                    throw new Error(resultInitial.errorMessage);
                }

                const chunks = createChunksFromBase64(base64file);
                for (const chunk of chunks) {
                    if (storageStatus.canceled) {
                        dispatch({ type: 'CLEAR_PAUSE_DATA' })
                        await ServerDogApi.cleanUpCanceled(storageStatus.pausedDog.picture.name);
                        break;
                    }
                    if (storageStatus.paused) {
                        const position = chunks.indexOf(chunk);
                        dispatch({
                            type: 'PAUSE_UPLOAD_DATA',
                            pausedPosition: position,
                            pausedDog: customDog,
                            pausedChunks: chunks
                        });
                        break;
                    }
                    const resultChunk = await ServerDogApi.saveDogCustomChunk(name, chunk);
                    if (!resultChunk.successful) {
                        throw new Error(resultChunk.errorMessage);
                    }
                    
                    console.log(`progress: ${resultChunk.result}`)

                    dispatch({
                        type: 'UPDATE_PROGRESS_BAR',
                        percentage: resultChunk.result
                    });
                }
                const resultFinal = await ServerDogApi.saveDogCustomFinal(customDog)

                if (resultFinal.successful) {
                    dispatch({ type: 'DOG_PICTURE_UPLOADED' })
                } else {
                    dispatch({ type: 'FIREBASE_STORAGE_ERROR', errorMessage: result.errorMessage })
                }
            } catch (error) {
                console.log(error);
                return { result: false, errorMessage: error.message }
            }
        },
        pausePictureUpload: () => {
            dispatch({ type: 'PAUSE_UPLOAD' });
        },
        cancelPictureUpload: () => {
            dispatch({ type: 'CANCEL_UPLOAD' });
        },
        resumePictureUpload: async () => {
            storageStatus.paused = false;
            for (let i = storageStatus.pausedPosition; i < storageStatus.pausedChunks.length; i++) {
                const chunk = storageStatus.pausedChunks[i];

                if (storageStatus.canceled) {
                    dispatch({ type: 'REMOVE_PAUSE_STATE' })
                    await ServerDogApi.cleanUpCanceled(storageStatus.pausedDog.picture.name);
                    break;
                }
                if (storageStatus.paused) {
                    dispatch({
                        type: 'PAUSE_CUSTOM_UPLOAD',
                        pausedPosition: i,
                    });
                    break;
                }

                const resultChunk = await ServerDogApi.saveDogCustomChunk(storageStatus.pausedDog.picture.name, chunk);
                console.log(` progress: ${resultChunk.result}`)
                dispatch({
                    type: 'UPDATE_PROGRESS_BAR',
                    percentage: resultChunk.result
                });
            }
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