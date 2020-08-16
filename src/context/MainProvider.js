import React from 'react'
import AuthProvider from './AuthContext'
import DrawerProvider from './DrawerContext'

function MainProvider({ children }) {
    return (
        <div>
            <AuthProvider>
                <DrawerProvider>
                    {children}
                </DrawerProvider>
            </AuthProvider>
        </div>
    )
}

export default MainProvider
