import React from 'react';
import '../Styles/App.css';
import Header from './Header/Header'
import Main from './Main'
import Public from './Public'
import Private from './Private/Private'
import Login from './Login'
import Next from './Next'
import Registration from './Registration'
import { Switch, Route } from 'react-router-dom'

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
                <Route path='/private'>
                    <Private />
                </Route>
                <Route path='/login'>
                    <Login />
                </Route>
                <Route path='/registration'>
                    <Registration />
                </Route>
                <Route path='/next'>
                    <Next />
                </Route>
            </Switch>
        </div>)
}

export default MainApp;
