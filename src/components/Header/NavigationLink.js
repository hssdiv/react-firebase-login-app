import React from 'react'
import { Link } from 'react-router-dom'

function NavigationLink({ path, onClick, name }) {
    return (
        <Link
            className={'nav-links'}
            to={path}
            onClick={onClick}>
            <li>
                {name}
            </li>
        </Link>
    )
}

export default NavigationLink
