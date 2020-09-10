import React from 'react'
import { Link } from 'react-router-dom'

function NavigationLink({ path, onClick, name, from }) {

    const state = {from : from}
    const newTo = {pathname: path, state: state};
    
    return (
        <Link
            className={'nav-links'}
            to={newTo}
            onClick={onClick}>
            <li>
                {name}
            </li>
        </Link>
    )
}

export default NavigationLink
