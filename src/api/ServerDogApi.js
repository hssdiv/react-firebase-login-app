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

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/save`, requestOptions)
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
    saveDog2: async (dogToSave) => {
        try {

            const size = dogToSave.picture.size;

            // const requestOptions = generateLocalRequestOptionsCustom('POST', { size, name: dogToSave.picture.filename });
            // const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/save2`, requestOptions)
            // const result = await response.json();
            // console.log('response from server:')
            // console.log(result)
            // if (!response.ok) {
            //     throw new Error(`error: ${result}`);
            // }

            // const toBase64 = file => new Promise((resolve, reject) => {
            //     const reader = new FileReader();
            //     reader.readAsDataURL(file);
            //     reader.onload = () => resolve(reader.result);
            //     reader.onerror = error => reject(error);
            // });
            // await toBase64(file));

            const createChunks2 = (str) => {
                const size = 16 * 1024;
                var chunks = [];
                while (str) {
                    if (str.length < size) {
                        chunks.push(str);
                        break;
                    }
                    else {
                        chunks.push(str.substr(0, size));
                        str = str.substr(size);
                    }
                }
                return chunks;
            }

            const toBase64 = file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            const base64file = await toBase64(dogToSave.picture);
            const chunks2 = createChunks2(base64file);
            

            

            const createChunks = (file, cSize/* cSize should be byte */) => {
                let startPointer = 0;
                let endPointer = file.size;
                let chunks = [];
                while (startPointer < endPointer) {
                    let newStartPointer = startPointer + cSize;
                    chunks.push(file.slice(startPointer, newStartPointer));
                    startPointer = newStartPointer;
                }
                return chunks;
            }
            const chunks = createChunks(dogToSave.picture, 1024 * 64);
            //const chunks = createChunks(dogToSave.picture, 1024 * 1024);

            const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = reject;
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });


            const sendChunk = async (chunk) => {

                // ????? const chunkBase64 = await convertBlobToBase64(chunk);

                const options = {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json', 'Content-Transfer-Encoding': 'base64' },
                    body: JSON.stringify({ chunk, name: dogToSave.picture.name })
                }
                //const requestOptions = generateLocalRequestOptions('POST', { chunk: 'asdasd', name: 'sdfsdf' });
                const requestOptions = generateLocalRequestOptions('POST', { chunk, name: dogToSave.picture.name });
                console.log(options);
                const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/save3`, options)
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(`error: ${result}`);
                }
                return result;
            }
            //let chunkNumber = 1;

            for (const chunk of chunks2) {
                console.log(chunk)
                const result = await sendChunk(chunk)
                console.log(result);
            }

            const requestOptions = generateLocalRequestOptions('POST', { final: 'true', name: dogToSave.picture.name });
            console.log(requestOptions);
            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/save3`, requestOptions)
            const result = await response.json();
            if (!response.ok) {
                throw new Error(`error: ${result}`);
            }



        } catch (error) {
            return { successful: false, errorMessage: error.message }
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

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/dogs/delete?` + new URLSearchParams({
                id: dogId
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
