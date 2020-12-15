import React, { useReducer, useEffect, createContext } from 'react'
//import auth from '../config/firebase'
import AuthApi from '../api/ExpressAuthApi'

const reducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOGGED_IN':
            console.log('reducer: user ' + action.email + ' logged in')
            return state = { email: action.email }
        case 'USER_REGISTERED':
            console.log('reducer: user ' + action.email + ' registered')
            return null
        case 'USER_LOGGED_OUT':
            console.log('reducer: user logged out')
            return null
        default:
            return state
    }
}

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const initialState = null;
    const [currentUser, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        const initialLogin = async () => {
            const result = await AuthApi.initialLogin();
            if (result.successful) {
                dispatch({ type: 'USER_LOGGED_IN', email: result.email })
            }
        }
        initialLogin();

        // const unregisterAuthObserver = auth.onAuthStateChanged(user => {
        //     console.log('auth state change detected');
        //     if (user) {
        //         dispatch({ type: 'USER_LOGGED_IN', email: user.email })
        //     }
        // })
        // return () => unregisterAuthObserver()
    }, [])

    const session = {
        userSignIn: async (login, password) => {
            const result = await AuthApi.login(login, password)
            if (result.successful) {
                dispatch({ type: 'USER_LOGGED_IN', email: login })
                return { result: true }
            } else {
                return { result: false, errorMessage: result.errorMessage }
            }
        },
        userRegistered: async (login, password) => {
            const result = await AuthApi.register(login, password)
            if (result.successful) {
                dispatch({ type: 'USER_REGISTERED', email: login })
                return { result: true }
            } else {
                return { result: false, errorMessage: result.errorMessage }
            }
        },
        userLogOut: async () => {
            const result = await AuthApi.logout()
            if (result.successful) {
                dispatch({ type: 'USER_LOGGED_OUT' })
            } else {
                return { result: false, errorMessage: result.errorMessage }
            }
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