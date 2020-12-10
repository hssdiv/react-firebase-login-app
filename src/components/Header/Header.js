import React, { useState, useContext, useEffect, useRef } from 'react'
import { AuthContext, DrawerContext } from '../../context/'
import NavigationLink from './NavigationLink'
import '../../styles/Header.css';
import '../../styles/Drawer.css';
import Drawer from './Drawer'
import DrawerButton from './DrawerButton'
import { useLocation } from 'react-router-dom';
import { FirebaseStorageContext } from './../../context/'

export function Header() {
    const { currentUser, session } = useContext(AuthContext)
    const { drawerIsOpen } = useContext(DrawerContext)

    const location = useLocation();

    const progressRef = useRef(null)

    const { storageStatus } = useContext(FirebaseStorageContext)

    const [pictureUploaded, setPictureUploaded] = useState(false)

    useEffect(() => {
        if (storageStatus) {
            switch (storageStatus.status) {
                case 'PROGRESS':
                    if (storageStatus.percentage === 0) {
                        setPictureUploaded(false)
                    }
                    console.log('setting progress to ' + storageStatus.percentage)
                    progressRef.current.value = storageStatus.percentage;
                    break;
                case 'UPLOADED':
                    if (process.env.REACT_APP_SERVER === 'GOOGLE') {
                        setPictureUploaded(true);
                        console.log('setting progress back to 0');
                        //progressRef.current.value = 0;
                    }
                    break;
                default:
                    break
            }
        }
    }, [storageStatus])

    return (
        <>
            {currentUser ?
                <>
                    {drawerIsOpen ?
                        <Drawer />
                        :
                        <Drawer style={{ width: '0px' }} />
                    }
                    <nav className='header-container'>
                        <>
                            {drawerIsOpen ?
                                <DrawerButton style={{ visibility: 'hidden' }} />
                                :
                                <DrawerButton />
                            }
                            <ul className='header-links'>
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
                <nav className='header-container'>
                    <ul className='header-links'>
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
            {pictureUploaded ?
                <div
                    className='progressbar-container'>
                    <progress
                        className="progressbar2"
                        value="0"
                        max="100"
                        ref={progressRef}
                    >
                        0%
                    </progress>
                </div>
                :
                <div
                    className='progressbar-container'>
                    <progress
                        className="progressbar"
                        value="0"
                        max="100"
                        ref={progressRef}
                    >
                        0%
                     </progress>
                </div>
            }

        </>
    )
}