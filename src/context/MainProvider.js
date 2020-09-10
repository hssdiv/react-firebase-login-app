import React from 'react'
import { AuthProvider, DrawerProvider, PlanetsProvider, DogsProvider } from './'

function MainProvider({ children }) {
    return (
        <div>
            <AuthProvider>
                <DrawerProvider>
                    <PlanetsProvider>
                        <DogsProvider>
                            {children}
                        </DogsProvider>
                    </PlanetsProvider>
                </DrawerProvider>
            </AuthProvider>
        </div>
    )
}

export default MainProvider
