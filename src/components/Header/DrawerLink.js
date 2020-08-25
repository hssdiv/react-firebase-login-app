import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function DrawerLink({ path, onClick, name }) {
    const location = useLocation()
    const [currentlySelected, setCurrentlySelected] = useState(false)

    useEffect(() => {
        if (path === location.pathname) {
            setCurrentlySelected(true);
        } else {
            setCurrentlySelected(false)
        }
    }, [path, location.pathname])

    return (
        <Link
            className={'drawer-links'}
            to={path}
            onClick={onClick}
            style={currentlySelected ? { color: 'white' } : {} }>
            {name}
        </Link>
    )
}

export default DrawerLink
