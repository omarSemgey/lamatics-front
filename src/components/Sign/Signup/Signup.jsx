import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react';
import axios from 'axios';

export default function Signup(){
    const navigate= useNavigate();

    const name = useRef();
    const email = useRef();
    const password = useRef();

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false)

    function getErrorType(message){
        if (message.includes('already been taken')) return 'unique';
        if (message.includes('valid email address')) return 'email';
        if (message.includes('valid')) return 'regex';
        if (message.includes('required')) return 'required';
        if (message.includes('at least')) return 'min';
        if (message.includes('greater than')) return 'max';
        if (message.includes('must be')) return 'invalid';
        return 'other';
    }

    const errorMessages = {
        name: {
            required: 'Name field is required',
            min: 'Minimum name length is 3 characters',
            max: 'Maximum name length is 25 characters',
            regex: 'Only letters (from any language), numbers, spaces, and underscores (_) are allowed. Special characters or other symbols are not allowed',
            unique: 'This name is already taken',
            invalid: 'Invalid name format'
        },
        email: {
            required: 'Email field is required',
            email: 'Invalid email format',
            max: 'Maximum email length is 320 characters',
            regex: 'Please enter a valid email (e.g., example@domain.com)',
            unique: 'This email is already used'
        },
        password: {
            required: 'Password field is required',
            min: 'Minimum password length is 6 characters',
            regex: 'Password must contain at least one English letter and one number',
            invalid: 'Invalid password format'
        },
        unkown: {
            other: 'An unknown error occurred, please try again'
        }
    };


    function register(event){
        event.preventDefault();
        setIsSubmitting(true);

        setErrors({});

        axios.post('/auth/register', {
            name: name.current.value.trim(),
            email: email.current.value,
            password: password.current.value,
            role: 1,
        })
        .then((response) => {
            localStorage.setItem('isAuthenticated',true);
            response.data.role > 1 ? navigate('/dashboard') : navigate('/quizzes');
        })
        .catch(error => {
            if (error.response?.data?.errors) {
                const formattedErrors = {};
                Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                    const errorType = getErrorType(messages[0]);
                    formattedErrors[field] = errorMessages[field]?.[errorType] || messages[0];
                });
                setErrors(formattedErrors);
            }else {
                setErrors({ unkown: "Unkown error happened please try again later." });
            }
        }).finally(()=>{
            setIsSubmitting(false)
        })
    }

    return (
        <>
            <div className='header'>
                <h1>Create Account</h1>
                <span> Create an account or <Link to={'/login'}>Login</Link></span>
            </div>

            <form>
                <div>
                    <label>Username</label>
                    <input 
                        required
                        ref={name} 
                        type="text" 
                        placeholder='Username'
                        pattern="^[\p{L}0-9_\s]{3,25}$"
                        minLength={3}
                        maxLength={25}
                    />
                    {errors.name && <p className='error'>{errors.name}</p>}
                </div>

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
                    {errors.email && <p className='error'>{errors.email}</p>}
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
                    {errors.password && <p className='error'>{errors.password}</p>}
                </div>

                {errors.unkown && <p className='error'>{errors.unkown}</p>}
    
                <button type="submit" disabled={isSubmitting} onClick={register}>
                    {isSubmitting ? "Loading..." : "Create Account"}
                </button>
            </form>
        </>
    )
}