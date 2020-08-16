import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom'
import MainProvider from './context/MainProvider'
import { DrawerContext } from './context/DrawerContext'
import GetWidth from './ui/useWindowSize'
import MainApp from './MainApp'

function App() {
    const currentScreenWidth = GetWidth()

    return (
        <MainProvider>
            <BrowserRouter>
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
            </BrowserRouter>
        </MainProvider>
    );
}

export default App;
