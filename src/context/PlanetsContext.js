import React, { useReducer } from 'react'
import { fetchStarWarsPlanets } from '../api/PlanetsApi'

const reducer = (state, action) => {
    switch (action.type) {
        case 'PLANETS_LOADED':
            console.log('reducer: planets loaded')
            return state = action.planetsResult;
        default:
            return state
    }
}

export const PlanetsContext = React.createContext();

export function PlanetsProvider({ children }) {
    const initialState = null;
    const [planetsResult, dispatch] = useReducer(reducer, initialState)

    const planetsMethods = {
        fetchPlanets: async () => {
            if (planetsResult) {
                console.log('planets already loaded, exiting fetch')
            } else {
                console.log('loading planets...')
                const result = await fetchStarWarsPlanets()
                
                if (result) {
                    dispatch({ type: 'PLANETS_LOADED', planetsResult: result })
                    return { loaded: true }
                } else {
                    return { loaded: false, errorMessage: 'error while loading planets' }
                }
                
            }
        }
    }

    return (
        <PlanetsContext.Provider
            value={{
                planetsResult,
                planetsMethods
            }}
        >
            {children}
        </PlanetsContext.Provider >
    );
}