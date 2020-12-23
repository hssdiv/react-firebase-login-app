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
                    id: dog.dog_id,
                    breed: dog.breed,
                    subBreed: dog.subbreed,
                    imageUrl: dog.imageurl,
                    custom: dog.custom,
                    picture: dog.picture,
                    timestamp: dog.timestamp,
                })))
                return { successful: true, dogsData: dogsData }
            } else {
                console.log(response.statusText)
                console.log(result)
                throw new Error(`error ${result}`)
            }
        } catch (error) {
            return { successful: true, errorMessage: error.message }
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

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dog/save`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                throw new Error(`error: ${result}`);
            }
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    updateDog: async (updatedDogWithId) => {
        try {
            const requestOptions = generateLocalRequestOptions('PATCH', updatedDogWithId);

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dog/update`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                throw new Error(`error: ${result}`);
            }
        } catch (error) {
            console.log(error.message)
            return { successful: false }
        }
    },
    deleteDog: async (dogId) => {
        try {
            const requestOptions = generateLocalRequestOptions('DELETE');

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dog/delete?` + new URLSearchParams({
                dog_id: dogId
            }), requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                throw new Error(`error: ${result}`);
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
                throw new Error(`error: ${result}`);
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
                throw new Error(`error: ${result}`);
            }
        } catch (error) {
            console.log(error.message)
            return { successful: false }
        }
    }
}
