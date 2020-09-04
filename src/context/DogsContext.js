import React, { useReducer } from 'react'
import { getRandomDog } from '../api/DogApi'


const reducer = (state, action) => {
    switch (action.type) {
        case 'DOG_LOADED':
            console.log('reducer: dog loaded')
            return state = action.dogResult;
        default:
            return state
    }
}

export const DogsContext = React.createContext();

export function DogsProvider({ children }) {
    const initialState = null;
    const [dogResult, dispatch] = useReducer(reducer, initialState)

    const dogMethods = {
        getRandomDog: async () => {
            console.log('loading dog...')
            const result = await getRandomDog()

            if (result) {
                dispatch({ type: 'DOG_LOADED', dogResult: result })
                return { loaded: true }
            } else {
                return { loaded: false, errorMessage: 'error while loading dog' }
            }
        }
    }

    return (
        <DogsContext.Provider
            value={{
                dogResult,
                dogMethods
            }}
        >
            {children}
        </DogsContext.Provider >
    );
}