import React from 'react';
import '../styles/App.css';
import { Header, Public, Private, Login, Registration} from './Header'
import Main from './Main'
import { Next, Planets, Dogs } from './Drawer';
import { Switch, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

function MainApp(props) {
    return (
        <div id='App' className='App' style={props.style}>
            <Header />
            <Switch>
                <Route path='/' exact>
                    <Main />
                </Route>
                <Route path='/public'>
                    <Public />
                </Route>
                <PrivateRoute path='/private' >
                    <Private/>
                </PrivateRoute>
                <Route path='/login'>
                    <Login />
                </Route>
                <Route path='/registration'>
                    <Registration />
                </Route>
                <PrivateRoute path='/next'>
                    <Next/>
                </PrivateRoute>
                <PrivateRoute path='/planets'>
                    <Planets/>
                </PrivateRoute>
                <PrivateRoute path='/dogs'>
                    <Dogs/>
                </PrivateRoute>
            </Switch>
        </div>)
}

export default MainApp;
