import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import Private from './Private/Private'
import Public from './Public'
import { useHistory, Route, Redirect } from 'react-router-dom'

function Main(props) {
    const { currentUser } = useContext(AuthContext)
    const history = useHistory();

    const shouldGo = useRef(null);

    useEffect(() => {
        if (currentUser && props.location && props.location.state && props.location.state.from) {
            console.log('going to previous location')
            shouldGo.current = true
        }

    }, [currentUser, history, props.location])


    return (
        currentUser ?
            (
                (shouldGo && props.location && props.location.state && props.location.state.from) ?
                    <Route>
                        <Redirect to={
                            {
                                pathname: props.location.state.from.pathname,
                            }
                        } />
                    </Route>
                    :
                    <Private>
                    </Private>
            )
            :
            <Public/>
    )
}

export default Main
