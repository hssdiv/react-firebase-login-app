import React from 'react'
import { AuthProvider, DrawerProvider, PlanetsProvider, DogsProvider, FirebaseStorageProvider } from './'

function MainProvider({ children }) {
    return (
        <div>
            <AuthProvider>
                <DrawerProvider>
                    <FirebaseStorageProvider>
                        <PlanetsProvider>
                            <DogsProvider>
                                {children}
                            </DogsProvider>
                        </PlanetsProvider>
                    </FirebaseStorageProvider>
                </DrawerProvider>
            </AuthProvider>
        </div>
    )
}

export default MainProvider
