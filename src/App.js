import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import MainProvider from './context/MainProvider'
import { DrawerContext } from './context/DrawerContext'
import GetWidth from './ui/useWindowSize'
import MainApp from './components/MainApp'
import { AuthContext } from './context/AuthContext';

function App() {
    const currentScreenWidth = GetWidth()

    return (
        <MainProvider>
            <BrowserRouter>
                    <AuthContext.Consumer>
                        {
                            user => {
                                return (
                                    user.currentUser ?
                                        <DrawerContext.Consumer>
                                            {
                                                drawer => {
                                                    return (
                                                        (drawer.drawerIsOpen && (currentScreenWidth > 1000))
                                                            ?
                                                            <MainApp style={{ marginLeft: '250px' }} />
                                                            :
                                                            <MainApp />
                                                    )
                                                }
                                            }
                                        </DrawerContext.Consumer>
                                        :
                                        <MainApp />
                                )
                            }
                        }
                    </AuthContext.Consumer>
            </BrowserRouter>
        </MainProvider>
    );
}

export default App;
