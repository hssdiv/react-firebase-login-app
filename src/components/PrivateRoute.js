import React, { useContext, cloneElement, Children } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function PrivateRoute({ children, location, ...rest }) {
    const { currentUser } = useContext(AuthContext)

    return (
        <Route
            {...rest}
            render={() =>
                currentUser ?
                    Children.map(children, child => cloneElement(child, { ...child.props }))
                    :
                    <>
                        {console.log('no user found, private route is redirecting login page from: ' + location.pathname)}
                        <Redirect to={
                            {
                                pathname: '/',
                                state: {
                                    from: location.pathname
                                }
                            }
                        } />
                    </>

            }
        />
    )
}

export default PrivateRoute
