import React, { useEffect, useRef, useCallback, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Login.css';

function Login() {
    const [errorMsg, setErrorMsg] = useState('')

    const { session } = useContext(AuthContext)

    const history = useHistory();

    const handleLogin = useCallback(async event => {
        event.preventDefault();
        const { login_email, login_password } = event.target.elements;

        const signInResult = await session.userSignIn(login_email.value, login_password.value);

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
        <form
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
                    type='text'
                    placeholder='Enter Username'
                    ref={inputRef}
                    name='login_email'
                    required />
                <label>
                    <b>Password</b>
                </label>
                <input
                    type='password'
                    placeholder='Enter Password'
                    name='login_password'
                    required />
                <button
                    type='submit'>
                    Login
                </button>
            </div>
        </form>
    )
}

export default Login
