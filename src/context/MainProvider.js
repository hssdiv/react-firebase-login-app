import React from 'react'
import { AuthProvider, DrawerProvider, PlanetsProvider, DogsProvider, FirebaseStorageProvider, FirestoreProvider } from './'

function MainProvider({ children }) {
    return (
        <div>
            <AuthProvider>
                <DrawerProvider>
                    <FirebaseStorageProvider>
                        <FirestoreProvider>
                            <PlanetsProvider>
                                <DogsProvider>
                                    {children}
                                </DogsProvider>
                            </PlanetsProvider>
                        </FirestoreProvider>
                    </FirebaseStorageProvider>
                </DrawerProvider>
            </AuthProvider>
        </div>
    )
}

export default MainProvider
