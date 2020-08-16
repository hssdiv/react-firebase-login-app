import React from 'react';
import './App.css';
import Header from './components/Header/Header'
import Main from './components/Main'
import Public from './components/Public'
import Private from './components/Private/Private'
import Login from './components/Login'
import Next from './components/Next'
import Registration from './components/Registration'
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
