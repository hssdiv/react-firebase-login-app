import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function PrivateRoute({ component: Component, ...rest }) {
    const { currentUser } = useContext(AuthContext)

    return (
        <Route
            {...rest}
            render={props => {
                if (currentUser) {
                    return <Component {...props} />;
                }
                else {
                    console.log('no user found, private route is redirecting main page')
                    return <Redirect to={
                        {
                            pathname: '/',
                            state: {
                                from: props.location
                            }
                        }
                    } />
                }
            }
            }
        />
    )
}

export default PrivateRoute
