import React, { useContext } from 'react'
import DrawerLink from './DrawerLink'
import { DrawerContext } from '../../context/DrawerContext'

function Drawer(props) {
    const { drawerMethods } = useContext(DrawerContext)

    const handleCloseDrawer = () => {
        drawerMethods.closeDrawer()
    }

    return (
        <div id='drawer' className='sidenav' style={props.style}>
            <span
                className='closebtn'
                onClick={() => handleCloseDrawer()}>
                &times;
                        </span>
            <DrawerLink
                name='Next'
                path='/next'
            />
            <DrawerLink
                name='Dogs'
                path='/dogs'
            />
        </div>
    )
}

export default Drawer
