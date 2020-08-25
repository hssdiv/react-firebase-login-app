import React, { useEffect, useRef, useCallback, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Login.css';
import Spinner from './Spinner'

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
        <form 
            className='sign-form'
            onSubmit={handleLogin}>
            <div
                style={{ color: 'red' }}>
                {errorMsg}
            </div>
            <div
                className='container'>
                <h1>Login</h1>
                <label>
                    <b>Email</b>
                </label>
                <input
                    className='sign-input'
                    type='text'
                    placeholder='Enter Username'
                    ref={inputRef}
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
        {spinnerIsVisible &&
        <Spinner/>}
        </>
    )
}

export default Login
