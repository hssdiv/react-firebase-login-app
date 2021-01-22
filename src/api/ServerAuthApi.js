import { generateLocalRequestOptions } from '../util/LocalRequestOptions'

export default {
    login: async (login, password) => {
        try {
            const requestOptions = generateLocalRequestOptions('POST', {
                email: login,
                password: password
            });

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/auth/login`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                console.log(response.statusText)
                console.log(result)
                throw new Error(`error: ${result.message}`);
            }
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    register: async (login, password) => {
        try {
            const requestOptions = generateLocalRequestOptions('POST', {
                email: login,
                password: password
            });

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/auth/register`, requestOptions)
            const result = await response.json();

            if (response.ok) {
                console.log('response from server:')
                console.log(result)

                return { successful: true }
            } else {
                console.log(response.statusText)
                console.log(result)
                throw new Error(`error: ${result.message}`);
            }
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    logout: async () => {
        try {
            const requestOptions = generateLocalRequestOptions('GET');

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/auth/logout`, requestOptions)

            if (response.ok) {
                const result = await response.json();
                console.log('response from server:')
                console.log(result)
                return { successful: true }
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    initialLogin: async () => {
        try {
            const requestOptions = generateLocalRequestOptions('GET');

            const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER_ADRESS}/auth/`, requestOptions)
            console.log(response)
            if (response.ok) {
                const result = await response.json();
                console.log('response from server:')
                console.log(result)
                return { successful: true, email: result.payload.email }
                // dispatch({ type: 'USER_LOGGED_IN', email: result.email })
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(`login error: ${error.message}`)
            return { successful: false, errorMessage: error.message }
        }
    }
}
