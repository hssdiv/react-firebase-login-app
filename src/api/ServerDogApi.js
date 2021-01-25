import { generateLocalRequestOptions } from '../util/LocalRequestOptions'
import { generateLocalRequestOptionsCustom } from '../util/LocalRequestOptionsCustom';

export default {
    getDogs: async () => {
        try {
            const requestOptions = generateLocalRequestOptions('GET');

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/get`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                const dogsData = [];
                result.forEach(dog => dogsData.push(({
                    id: dog.id,
                    breed: dog.breed,
                    subBreed: dog.subBreed,
                    imageUrl: dog.imageUrl,
                    custom: dog.custom,
                    picture: dog.picture,
                    timestamp: dog.timestamp,
                })))
                return { successful: true, dogsData: dogsData }
            } else {
                console.log(response.statusText)
                console.log(result)
                throw new Error(`error: ${result.message}`)
            }
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    saveDog: async (dogToSave) => {
        try {
            function getFormData(object) {
                let formData = new FormData();
                Object.keys(object).forEach(key => {
                    if (key === 'picture') {
                        console.log('picture!!!')
                        console.log(object[key].name)
                        formData.append(key, object[key], object[key].name)
                    } else {
                        formData.append(key, object[key])
                    }
                }
                );
                return formData;
            }

            console.log(dogToSave)
            const formDogData = getFormData(dogToSave)

            const requestOptions = generateLocalRequestOptionsCustom('POST', formDogData);

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/save`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                throw new Error(`error: ${result.message}`);
            }
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    saveDogCustomInitial: async (name, base64file) => {
        try {
            const size = Buffer.from(base64file.substring(base64file.indexOf(',') + 1));

            const requestOptionsInitial = generateLocalRequestOptions('POST', {
                size: size.length,
                name,
            });

            const responseInitial = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/save/custom/initial`, requestOptionsInitial)
            const resultInitial = await responseInitial.json();
            console.log('response from server:')
            console.log(resultInitial)

            if (!responseInitial.ok) {
                throw new Error(`error: ${resultInitial.message}`);
            }

            return { successful: true, base64file }
        } catch (error) {
            console.log(error);
            return { successful: false, errorMessage: error.message }
        }
    },
    saveDogCustomChunk: async (name, chunk) => {
        try {
            const requestOptions = generateLocalRequestOptions('POST', { chunk, name });
            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/save/custom`, requestOptions)
            const result = await response.json();
            if (!response.ok) {
                throw new Error(`error: ${result.message}`);
            }
            return { successful: true, result };
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    saveDogCustomFinal: async (name, dogToSave) => {
        try {
            console.log('sending final');
            console.log(name);
            console.log(dogToSave);
            const requestOptions = generateLocalRequestOptions('POST', {
                name,
                breed: dogToSave.breed,
                subBreed: dogToSave.subBreed,
            });
            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/save/custom/final`, requestOptions)
            const result = await response.json();
            console.log(result);
            if (!response.ok) {
                throw new Error(`error: ${result.message}`);
            }

            return { successful: true }
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    cleanUpCanceled: async (name) => {
        try {
            const requestOptions = generateLocalRequestOptions('POST', {
                name
            });
            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/save/custom/cleanup`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            }
        } catch (error) {
            console.log(error.message)
            return { successful: false }
        }
    },
    updateDog: async (updatedDogWithId) => {
        try {
            const requestOptions = generateLocalRequestOptions('PATCH', updatedDogWithId);

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/update`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                throw new Error(`error: ${result.message}`);
            }
        } catch (error) {
            console.log(error.message)
            return { successful: false }
        }
    },
    deleteDog: async (dogId) => {
        try {
            const requestOptions = generateLocalRequestOptions('DELETE');

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/delete?` + new URLSearchParams({
                id: dogId
            }), requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                throw new Error(`error: ${result.message}`);
            }
        } catch (error) {
            console.log(error.message)
            return { successful: false }
        }
    },
    deleteSelectedDogs: async (dogs_ids) => {
        try {
            const requestOptions = generateLocalRequestOptions('DELETE', { dogs_ids: dogs_ids });

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/delete/selected`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                throw new Error(`error: ${result.message}`);
            }
        } catch (error) {
            console.log(error.message)
            return { successful: false }
        }
    },
    deleteDogs: async () => {
        try {
            const requestOptions = generateLocalRequestOptions('DELETE');

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/delete/all`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                throw new Error(`error: ${result.message}`);
            }
        } catch (error) {
            console.log(error.message)
            return { successful: false }
        }
    }
}