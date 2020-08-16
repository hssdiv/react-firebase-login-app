import React, { useReducer } from 'react'
import GetWidth from '../ui/useWindowSize'

export const DrawerContext = React.createContext();

const reducer = (state, action) => {
    switch (action) {
        case 'drawer_opened':
            return state = true
        case 'drawer_closed':
            return state = false
        default:
            return state
    }
}

function DrawerProvider({ children }) {
    const initialState = GetWidth() > 1000
    //const initialState = true

    const [drawerIsOpen, dispatch] = useReducer(reducer, initialState)

    const drawerMethods = {
        closeDrawer: () => {
            dispatch('drawer_closed')
        },
        openDrawer: () => {
            dispatch('drawer_opened')
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


export default DrawerProvider