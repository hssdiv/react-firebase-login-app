import React, { useEffect, useRef, useState, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import '../../styles/Login.css';
import Spinner from '../Spinner'
import SimpleErrorMessage from '../SimpleErrorMessage'

export function Login(props) {
    const [errorMsg, setErrorMsg] = useState('')
    const [submitButtonIsDisabled, setSubmitButtonIsDisabled] = useState(false)
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)
    const [userIsLoaded, setUserIsLoaded] = useState(false)

    const { currentUser, session } = useContext(AuthContext)

    const history = useHistory();

    const handleLogin = async (event) => {
        setSubmitButtonIsDisabled(true);
        setSpinnerIsVisible(true);

        event.preventDefault();
        const { loginEmail, loginPassword } = event.target.elements;

        const signInResult = await session.userSignIn(loginEmail.value, loginPassword.value);

        if (!signInResult.result) {
            setSpinnerIsVisible(false);
            setErrorMsg(signInResult.errorMessage)
            setSubmitButtonIsDisabled(false)
        }
    }

    const inputRef = useRef(null);

    let location = useLocation();

    useEffect(() => {
        console.log('location in login.js is:');
        console.log(location);
        const timeout = setTimeout(() => { setUserIsLoaded(true) }, 500)
        return () => clearTimeout(timeout)
    }, [location])

    

    useEffect(() => {
        if (currentUser) {
            setSubmitButtonIsDisabled(false)
            setSpinnerIsVisible(false);
            setErrorMsg('')
            
            if (location.state && location.state.from && currentUser) {
                history.push(location.state.from);
            } else if (currentUser) {
                history.push('/private');
            }
        }
    }, [currentUser, history, location, location.state])


    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }, [])

    const simpleErrorCallback = (result) => {
        setErrorMsg(result);
    }

    return (
        userIsLoaded ?
            <>
                {spinnerIsVisible &&
                    <Spinner />}
                <form
                    className='sign-form'
                    onSubmit={handleLogin}
                    autoComplete='on'>
                    <SimpleErrorMessage
                        error={errorMsg}
                        callback={simpleErrorCallback}
                    />
                    <div
                        className='container'>
                        <h1>Login</h1>
                        <label
                            htmlFor='email'>
                            <b>Email</b>
                        </label>
                        <input
                            id='email'
                            className='sign-input'
                            type='text'
                            ref={inputRef}
                            placeholder='Enter Email'
                            name='loginEmail'
                            required />
                        <label
                            htmlFor='password'>
                            <b>Password</b>
                        </label>
                        <input
                            id='password'
                            className='sign-input'
                            type='password'
                            placeholder='Enter Password'
                            name='loginPassword'
                            autoComplete='on'
                            required />
                        <button
                            disabled={submitButtonIsDisabled}
                            className='sign-button'
                            type='submit'>
                            Login
                        </button>
                    </div>
                </form>
            </>
            :
            <>
            </>

    )
}