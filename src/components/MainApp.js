import React from 'react';
import '../styles/App.css';
import Header from './Header/Header'
import Main from './Main'
import Public from './Public'
import Private from './Private'
import Login from './Login'
import Next from './Next'
import Registration from './Registration'
import { Switch, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Dogos from './Dogos'

function MainApp(props) {
    return (
        <div id='App' className='App' style={props.style}>
            <Header />
            <Switch>
                <Route path='/' exact component={Main}/>
                <Route path='/public' component={Public}/>
                <PrivateRoute path='/private' component={Private}/>
                <Route path='/login' component={Login}/>
                <Route path='/registration' component={Registration}/>
                <PrivateRoute path='/next' component={Next}/>
                <PrivateRoute path='/dogos' component={Dogos}/>
            </Switch>
        </div>)
}

export default MainApp;
