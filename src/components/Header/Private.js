import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

import '../../styles/Private.css';

export function Private() {
    const { currentUser } = useContext(AuthContext)

    return (
        <div>
            <h1>
                Private page
            </h1>
            <div>
                hello: {currentUser.email}
            </div>
        </div>
    )
}