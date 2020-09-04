import React, { useReducer } from 'react'
import GetWidth from '../ui/useWindowSize'

export const DrawerContext = React.createContext();

const reducer = (state, action) => {
    switch (action) {
        case 'DRAWER_OPENED':
            return state = true
        case 'DRAWER_CLOSED':
            return state = false
        default:
            return state
    }
}

export function DrawerProvider({ children }) {
    const initialState = GetWidth() > 1000
    //const initialState = true

    const [drawerIsOpen, dispatch] = useReducer(reducer, initialState)

    const drawerMethods = {
        closeDrawer: () => {
            dispatch('DRAWER_CLOSED')
        },
        openDrawer: () => {
            dispatch('DRAWER_OPENED')
        }
    }

    return (
        <DrawerContext.Provider
            value={{
                drawerIsOpen,
                drawerMethods
            }}
        >
            {children}
        </DrawerContext.Provider>
    );
}