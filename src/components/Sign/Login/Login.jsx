import { Link } from 'react-router-dom'
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login(){
    const navigate= useNavigate();

    const email = useRef();
    const password = useRef();

    const [notFoundError,setNotFoundError] = useState(false);
    const [emailError,setEmailError] = useState(false);
    const [passwordError,setPasswordError] = useState(false);
    const [unknownError, setUnknownError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)

    function login(event){
        event.preventDefault();
        setIsSubmitting(true)

        setEmailError(false);
        setPasswordError(false);
        setNotFoundError(false);

        axios.post('/auth/login', {
            email: email.current.value,
            password: password.current.value,
        })
        .then((response) => {
            // Cookie is automatically set by backend
            localStorage.setItem('isAuthenticated',true);
            response.data.role > 1 ? navigate('/dashboard') : navigate('/quizzes');
        })
        .catch(error => {
            const errorCode = error.response?.status;
            const errors = error.response?.data?.errors || {};

            if (errorCode === 422) {
                setEmailError(errors.email ? true : false);
                setPasswordError(errors.password ? true : false);
            }

            if (errorCode === 401) setNotFoundError(true);

            if (errorCode !== 401 && errorCode !== 422) setUnknownError(true);
        }).finally(()=>{
            setIsSubmitting(false)
        })
    }

    return(
        <>
            <div className='header'>
                <h1>Login</h1>
                <span> Login or<Link to={'/signup'}> Create Account </Link> </span>
            </div>

            <form>
                <div>
                    <label>Email Address</label>
                    <input 
                        required
                        ref={email} 
                        type="email" 
                        placeholder='Email Address'
                        pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$"
                        maxLength={320}
                    />
                    { emailError && <p className='error'> Please enter a valid emain adress.</p> }
                </div>

                <div>
                    <label>Password</label>
                    <input 
                        required
                        ref={password} 
                        type="password" 
                        placeholder='Password'
                        pattern="^(?=.*[A-Za-z])(?=.*\d).{6,}$"
                        minLength={6}
                    />
                    { passwordError && <p className='error'> Passwrod need to be at least 6 characters </p> }
                    { notFoundError && <p className='error'> Email adress or password is incorrect </p> }
                    { unknownError && <p> Unkown errror please try again </p> }
                </div>

                <button type="submit" disabled={isSubmitting} onClick={login}>Login</button>
            </form>
        </>
    )
}