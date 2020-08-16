import React, { useReducer, useEffect } from 'react'
import auth from './firebase'

const reducer = (state, action) => {
    switch (action.type) {
        case 'user_logged_in':
            console.log('reducer: user ' + action.email + ' logged in')
            return state = { email: action.email }
        case 'user_registered':
            console.log('reducer: user ' + action.email + ' registered')
            return state = { email: action.email }
        case 'user_logged_out':
            console.log('reducer: user logged out')
            return null
        default:
            return state
    }
}

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
    const initialState = null;
    const [currentUser, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(user => {
            dispatch({ type: 'user_logged_in', email: user.email })
        })
        return () => unregisterAuthObserver()
    }, [])

    const session = {
        userSignIn: async (login, password) => {
            try {
                const res = await auth.signInWithEmailAndPassword(login, password);
                console.log('user.email: ' + res.user.email)
                dispatch({ type: 'user_logged_in', email: res.user.email })
                return { result: true }
            } catch (error) {
                return { result: false, errorMessage: error.message }
            }
        },
        userRegistered: async (login, password) => {
            try {
                const res = await auth.createUserWithEmailAndPassword(login, password);
                dispatch({ type: 'user_registered', email: res.user.email })
                return { result: true }
            } catch (error) {
                return { result: false, errorMessage: error.message }
            }
        },
        userLogOut: async () => {
            await auth.signOut()
            dispatch({ type: 'user_logged_out' })
        }
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                session
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export default AuthProvider