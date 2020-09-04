import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Route, Redirect, useLocation } from 'react-router-dom'

function Main() {
    const { currentUser } = useContext(AuthContext)

    let location = useLocation();

    return (
        currentUser ?
            <>
            </>
            :
            <>
                {location.state && location.state.from ?
                    <Route>

                        <Redirect to={
                            {
                                pathname: '/login',
                                state: {
                                    from: location.state.from
                                }
                            }
                        } />
                    </Route>
                    :
                    <Route>
                        <Redirect to={
                            {
                                pathname: '/login'
                            }
                        } />

                    </Route>
                }
            </>

    )
}

export default Main
