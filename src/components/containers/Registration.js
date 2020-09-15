import React, { useEffect, useRef, useCallback, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'
import Spinner from './../Spinner'

export function Registration() {
    const [errorMsg, setErrorMsg] = useState('')
    const [submitButtonIsDisabled, setSubmitButtonIsDisabled] = useState(false)
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false)

    const history = useHistory();

    const { session } = useContext(AuthContext)

    const handleRegistration = useCallback(async event => {
        event.preventDefault();
        setSubmitButtonIsDisabled(true)
        setSpinnerIsVisible(true)
        const { registrationEmail, registrationPassword, registrationRepeatPassword } = event.target.elements;

        if (registrationPassword.value === registrationRepeatPassword.value) {
            const signUpResult = await session.userRegistered(registrationEmail.value, registrationPassword.value);

            setSpinnerIsVisible(false)
            setSubmitButtonIsDisabled(false)
            if (signUpResult.result) {
                console.log(signUpResult)
                setErrorMsg('')
                history.push('/private')
            } else {
                setSpinnerIsVisible(false)
                setSubmitButtonIsDisabled(false)
                setErrorMsg(signUpResult.errorMessage)
            }

        } else {
            setErrorMsg('passwords don\'t match')
            setSpinnerIsVisible(false)
            setSubmitButtonIsDisabled(false)
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
            onSubmit={handleRegistration}
            style={{ border: '1px solid #ccc' }}>
            <div className='container'>
                <h1>Registration</h1>
                <div style={{ color: 'red' }}>{errorMsg}</div>

                <label>
                    <b>Email</b>
                </label>

                <input
                    className='sign-input'
                    type='text'
                    ref={inputRef}
                    placeholder='Enter Email'
                    name='registrationEmail'
                    required />

                <label>
                    <b>Password</b>
                </label>

                <input
                    className='sign-input'
                    type='password'
                    placeholder='Enter Password'
                    name='registrationPassword'
                    required />

                <label>
                    <b>Repeat Password</b>
                </label>

                <input
                    className='sign-input'
                    type='password'
                    placeholder='Repeat Password'
                    name='registrationRepeatPassword'
                    required />

                <button
                    className='sign-button'
                    disabled={submitButtonIsDisabled}
                    type='submit'>
                    Sign Up
            </button>
            </div>
        </form>
        {spinnerIsVisible &&
        <Spinner/>}
        </>
    )
}