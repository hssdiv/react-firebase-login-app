import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Private from './Private/Private'
import Public from './Public'

function Main() {
    const { currentUser } = useContext(AuthContext)
    return (
        currentUser ?
            <Private />
            :
            <Public />
    )
}

export default Main
