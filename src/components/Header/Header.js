import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { DrawerContext } from '../../context/DrawerContext'
import NavigationLink from './NavigationLink'
import '../../styles/Header.css';
import Drawer from './Drawer'
import DrawerButton from './DrawerButton'
import { useLocation } from 'react-router-dom';

export function Header() {
    const { currentUser, session } = useContext(AuthContext)
    const { drawerIsOpen } = useContext(DrawerContext)

    const location = useLocation();

    return (
        <>
            {currentUser ?
                <>
                    {drawerIsOpen ?
                        <Drawer />
                        :
                        <Drawer style={{ width: '0px' }} />
                    }
                    <nav className='nav-container'>
                        <>
                            {drawerIsOpen ?
                                <DrawerButton style={{ visibility: 'hidden' }} />
                                :
                                <DrawerButton />
                            }
                            <ul className='nav-links'>
                                <NavigationLink
                                    name='Private'
                                    path='/private'
                                />
                                <NavigationLink
                                    name='Log out'
                                    path='/login'
                                    from={location}
                                    onClick={() => session.userLogOut()}
                                />
                            </ul>
                        </>
                    </nav>
                </>
                :
                <nav className='nav-container'>
                    <ul className='nav-links'>
                        <NavigationLink
                            name='Public'
                            path='/public'
                        />
                        <NavigationLink
                            name='Login'
                            path='/login'
                        />
                        <NavigationLink
                            name='Registration'
                            path='/registration'
                        />
                    </ul>

                </nav>
            }
        </>
    )
}