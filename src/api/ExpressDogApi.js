import { generateLocalRequestOptions } from '../util/LocalRequestOptions'

export default {
    getDogs: async () => {
        try {
            const requestOptions = generateLocalRequestOptions('GET');

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/getdogs`, requestOptions)
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
                return { successful: true, dogsData: dogsData}
            } else {
                console.log(response.statusText)
                console.log(result)
                throw new Error(`error ${result}`)
            }
        } catch (error) {
            return { successful: true, errorMessage: error.message}
        }
    },
    saveDog: async (dogToSave) => {
        try {
            const requestOptions = generateLocalRequestOptions('POST', dogToSave);

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/savedog`, requestOptions)
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

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/updatedog`, requestOptions)
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

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/deletedog?` + new URLSearchParams({
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

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/deleteselecteddogs`, requestOptions)
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

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/deletedogs`, requestOptions)
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
