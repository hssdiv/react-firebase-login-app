import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { DrawerContext } from '../../context/DrawerContext'
import NavigationLink from './NavigationLink'
import DrawerLink from './DrawerLink'

function Header() {
    const { currentUser, session } = useContext(AuthContext)
    const { drawerIsOpen, drawerMethods } = useContext(DrawerContext)

    const handleOpenDrawer = () => {
        drawerMethods.openDrawer()
    }

    const handleCloseDrawer = () => {
        drawerMethods.closeDrawer()
    }

    return (
        <>
            {currentUser &&
                (drawerIsOpen
                    ?
                    <div id='drawer' className='sidenav'>
                        <span
                            className='closebtn'
                            onClick={() => handleCloseDrawer()}>
                            &times;
                        </span>
                        <DrawerLink
                            name='Next'
                            path='/next'
                        />
                    </div>
                    :
                    <div id='drawer' className='sidenav' style={{ width: '0px' }}>
                        <span
                            className='closebtn'
                            onClick={() => handleCloseDrawer()}>
                            &times;
                    </span>
                        <DrawerLink
                            name='Next'
                            path='/next'
                        />
                    </div>
                )
            }
            <nav>
                {currentUser
                    ?
                    <>
                        <span
                            style={{ fontSize: '30px', cursor: 'pointer', alignSelf: 'left' }}
                            onClick={() => handleOpenDrawer()}>
                            &#9776;
                    </span>
                        <ul className='nav-links'>
                            <NavigationLink
                                name='Private'
                                path='/private'
                            />
                            <NavigationLink
                                name='Log out'
                                path='/login'
                                onClick={() => session.userLogOut()}
                            />
                        </ul>
                    </>
                    : <ul className='nav-links'>
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
                }
            </nav>
        </>
    )
}

export default Header
