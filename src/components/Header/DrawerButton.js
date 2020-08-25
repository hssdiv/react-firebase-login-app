import React, { useContext } from 'react'
import { DrawerContext } from '../../context/DrawerContext'

function DrawerButton(props) {
    const { drawerMethods } = useContext(DrawerContext)

    const handleOpenDrawer = () => {
        drawerMethods.openDrawer()
    }

    return (
        <span
            style={{ fontSize: '30px', cursor: 'pointer', alignSelf: 'left', ...props.style }}
            onClick={() => handleOpenDrawer()}>
            &#9776;
        </span>
    )
}

export default DrawerButton
