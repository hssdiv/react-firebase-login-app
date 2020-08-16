import React from 'react'
import { Link } from 'react-router-dom'

function DrawerLink({ path, onClick, name }) {
    return (
        <Link
            className={'drawer-links'}
            to={path}
            onClick={onClick}>
            <li>
                {name}
            </li>
        </Link>
    )
}

export default DrawerLink
