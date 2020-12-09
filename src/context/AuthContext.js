import React, { useReducer, useEffect, createContext } from 'react'
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

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const initialState = null;
    const [currentUser, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (process.env.REACT_APP_SERVER === 'GOOGLE') {
            const unregisterAuthObserver = auth.onAuthStateChanged(user => {
                console.log('auth state change detected');
                if (user) {
                    dispatch({ type: 'USER_LOGGED_IN', email: user.email })
                }
            })
            return () => unregisterAuthObserver()
        } else {
            login()
        }
    }, [])

    const login = async () => {
        try {
            const requestOptions = {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            };
            
            const response = await fetch('http://localhost:4000/login', requestOptions)
            console.log(response)
            const response2 = response.body;
            console.log(response2)
            if (response?.ok) {
                const result = await response.json();
                console.log('response from server:')
                console.log(result)
                dispatch({ type: 'USER_LOGGED_IN', email: result.email })
            } else {
                throw new Error(response?.statusText);
            }
        } catch (err) {
            console.log(`error: ${err.message}`)
        }
    }

    const session = {
        userSignIn: async (login, password) => {
            try {
                if (process.env.REACT_APP_SERVER === 'GOOGLE') {
                    const res = await auth.signInWithEmailAndPassword(login, password);
                    console.log('user.email: ' + res.user.email)
                    dispatch({ type: 'USER_LOGGED_IN', email: res.user.email })
                    return { result: true }
                } else {
                    const requestOptions = {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                    };

                    const response = await fetch('http://localhost:4000/login?' + new URLSearchParams({
                        email: login,
                        password: password
                    }), requestOptions)

                    if (response?.ok) {
                        const result = await response.json();
                        console.log('response from server:')
                        console.log(result)
                    } else {
                        throw new Error(response?.statusText);
                    }
                    dispatch({ type: 'USER_LOGGED_IN', email: login })
                    return { result: true }
                }
            } catch (error) {
                return { result: false, errorMessage: error.message }
            }
        },
        userRegistered: async (login, password) => {
            try {
                if (process.env.REACT_APP_SERVER === 'GOOGLE') {
                    const res = await auth.createUserWithEmailAndPassword(login, password);
                    dispatch({ type: 'USER_REGISTERED', email: res.user.email })
                } else {
                    const requestOptions = {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: login,
                            password: password
                        })
                    };

                    const response = await fetch('http://localhost:4000/register', requestOptions)

                    if (response?.ok) {
                        const result = await response.json();
                        console.log('response from server:')
                        console.log(result)
                    } else {
                        throw new Error(response?.statusText);
                    }
                    dispatch({ type: 'USER_REGISTERED', email: login })
                }

                return { result: true }
            } catch (error) {
                return { result: false, errorMessage: error.message }
            }
        },
        userLogOut: async () => {
            try {
                if (process.env.REACT_APP_SERVER === 'GOOGLE') {
                    await auth.signOut()
                    dispatch({ type: 'USER_LOGGED_OUT' })
                } else {
                    const requestOptions = {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                    };

                    const response = await fetch('http://localhost:4000/logout', requestOptions)

                    if (response?.ok) {
                        const result = await response.json();
                        console.log('response from server:')
                        console.log(result)
                        dispatch({ type: 'USER_LOGGED_OUT' })
                    } else {
                        throw new Error(response?.statusText);
                    }
                }
            } catch(err) {
                console.log(`error: ${err.message}`)
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