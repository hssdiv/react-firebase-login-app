import React, { useReducer, useEffect } from 'react'
import auth from '../config/firebase'

const reducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOGGED_IN':
            console.log('reducer: user ' + action.email + ' logged in')
            return state = { email: action.email }
        case 'USER_REGISTERED':
            console.log('reducer: user ' + action.email + ' registered')
            return state = { email: action.email }
        case 'USER_LOGGED_OUT':
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
            if (user) {
                console.log('auth state change detected');
                //TODO go to last page before refresh?
                dispatch({ type: 'USER_LOGGED_IN', email: user.email })
            }
        })
        return () => unregisterAuthObserver()
    }, [])

    const session = {
        userSignIn: async (login, password) => {
            try {
                const res = await auth.signInWithEmailAndPassword(login, password);
                console.log('user.email: ' + res.user.email)
                dispatch({ type: 'USER_LOGGED_IN', email: res.user.email })
                return { result: true }
            } catch (error) {
                return { result: false, errorMessage: error.message }
            }
        },
        userRegistered: async (login, password) => {
            try {
                const res = await auth.createUserWithEmailAndPassword(login, password);
                dispatch({ type: 'USER_REGISTERED', email: res.user.email })
                return { result: true }
            } catch (error) {
                return { result: false, errorMessage: error.message }
            }
        },
        userLogOut: async () => {
            await auth.signOut()
            dispatch({ type: 'USER_LOGGED_OUT' })
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