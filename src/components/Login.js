import React, { useEffect, useRef, useCallback, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Login.css';
import Spinner from './Spinner'
import SimpleErrorMessage from './SimpleErrorMessage'

function Login() {
    const [errorMsg, setErrorMsg] = useState('')
    const [submitButtonIsDisabled, setSubmitButtonIsDisabled] = useState(false)
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)

    const { session } = useContext(AuthContext)

    const history = useHistory();

    const handleLogin = useCallback(async event => {
        setSubmitButtonIsDisabled(true);
        setSpinnerIsVisible(true);
        

        event.preventDefault();
        const { loginEmail, loginPassword } = event.target.elements;

        const signInResult = await session.userSignIn(loginEmail.value, loginPassword.value);

        setSubmitButtonIsDisabled(false)
        setSpinnerIsVisible(false);
        if (signInResult.result) {
            setErrorMsg('')
            history.push('/private')
        } else {
            setErrorMsg(signInResult.errorMessage)
        }
        
    }, [history, session])

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, [])

    return (
        <>
        {spinnerIsVisible &&
        <Spinner/>}
        <form 
            className='sign-form'
            onSubmit={handleLogin}>
            <SimpleErrorMessage 
                error={errorMsg}
            />
            <div
                className='container'>
                <h1>Login</h1>
                <label>
                    <b>Email</b>
                </label>
                <input
                    className='sign-input'
                    type='text'
                    ref={inputRef}
                    placeholder='Enter Email'
                    name='loginEmail'
                    required />
                <label>
                    <b>Password</b>
                </label>
                <input
                    className='sign-input'
                    type='password'
                    placeholder='Enter Password'
                    name='loginPassword'
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
    )
}

export default Login
