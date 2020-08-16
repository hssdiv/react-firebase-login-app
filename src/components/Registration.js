import React, { useEffect, useRef, useCallback, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

function Registration() {
    const [errorMsg, setErrorMsg] = useState('')

    const history = useHistory();

    const { session } = useContext(AuthContext)

    const handleRegistration = useCallback(async event => {
        event.preventDefault();
        const { registration_email, registration_password, registration_repeat_password } = event.target.elements;

        if (registration_password.value === registration_repeat_password.value) {
            const signUpResult = await session.userRegistered(registration_email.value, registration_password.value);
            if (signUpResult) {
                setErrorMsg('')
                history.push('/private')
            } else {
                setErrorMsg(signUpResult.errorMessage)
            }

        } else {
            setErrorMsg('passwords don\'t match')
        }
    }, [history, session])

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, [])

    return (
        <form
            onSubmit={handleRegistration}
            style={{ border: '1px solid #ccc' }}>
            <div className='container'>
                <h1>Registration</h1>
                <div style={{ color: 'red' }}>{errorMsg}</div>

                <label>
                    <b>Email</b>
                </label>

                <input
                    type='text'
                    ref={inputRef}
                    placeholder='Enter Email'
                    name='registration_email'
                    required />

                <label>
                    <b>Password</b>
                </label>

                <input
                    type='password'
                    placeholder='Enter Password'
                    name='registration_password'
                    required />

                <label>
                    <b>Repeat Password</b>
                </label>

                <input
                    type='password'
                    placeholder='Repeat Password'
                    name='registration_repeat_password'
                    required />

                <button
                    type='submit'
                    className='signupbtn'>
                    Sign Up
            </button>
            </div>
        </form>
    )
}

export default Registration
