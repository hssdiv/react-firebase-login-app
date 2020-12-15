import auth from '../config/firebase'

export default {
    login: async (login, password) => {
        try {
            const res = await auth.signInWithEmailAndPassword(login, password);
            console.log('user.email: ' + res.user.email)
            // dispatch({ type: 'USER_LOGGED_IN', email: res.user.email })
            return { successful: true }
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    register: async (login, password) => {
        try {
            await auth.createUserWithEmailAndPassword(login, password);
            return { successful: true }
        } catch (error) {
            return { successful: false, errorMessage: error.message }
        }
    },
    logout: async () => {
        try {
            await auth.signOut()
            return { successful: true }
        } catch (error) {
            console.log(`error: ${error.message}`)
            return { successful: false, errorMessage: error.message }
        }
    },
    initialLogin: async () => {
        
    }
}