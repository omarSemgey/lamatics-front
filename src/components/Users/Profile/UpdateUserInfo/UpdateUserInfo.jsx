import './UpdateUserInfo.css'
import Loading from '../../../Loading/Loading';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

export default function UpdateUserInfo() {
    const navigate = useNavigate();
    const id = useOutletContext();

    const name = useRef();
    const email = useRef();
    const password = useRef();

    const [errors, setErrors] = useState({});
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false)

    function getErrorType(message) {
        if (message.includes('already been taken')) return 'unique';
        if (message.includes('valid email address')) return 'email';
        if (message.includes('must not be empty')) return 'required';
        if (message.includes('at least')) return 'min';
        if (message.includes('greater than')) return 'max';
        if (message.includes('must be a string')) return 'type';
        if (message.includes('format is invalid')) return 'format';
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

    useEffect(() => {
        const fetchUser = async () => {
            await axios.get(`/users/${id}`)
            .then((response) => {
                setData(response.data.user);
                setIsLoading(false);
            });
        };
        fetchUser();
    }, [id]);

    function UpdateUserInfo(event) {
        event.preventDefault();
        setIsSubmitting(true)
        setErrors({});

        const nameVal = name.current.value;
        const emailVal = email.current.value;
        const passwordVal = password.current.value;

        const updateData = {};
        if (nameVal) updateData.name = nameVal;
        if (emailVal) updateData.email = emailVal;
        if (passwordVal) updateData.password = passwordVal;

        axios.put(`/users/${id}`, updateData)
        .then(() =>{
            navigate('/profile')
        } )
        .catch(error => {
            if (error.response?.data?.errors) {
                const formattedErrors = {};
                Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                    const errorType = getErrorType(messages[0]);
                    formattedErrors[field] = errorMessages[field]?.[errorType] || messages[0];
                });
                setErrors(formattedErrors);
            }else{
                setErrors({ unkown: "Unkown error happened please try again later" });
            }
        }).finally(()=>{
            setIsSubmitting(false)
        })
    }

    if (isLoading) return <Loading />;

    return (
        <div className='update-profile'>
            <div className='container'>
                <div className='header'>
                    <h1>Edit Personal Account Information</h1>
                </div>

                <form>
                    <div>
                        <label>Username</label>
                        <input 
                            ref={name} 
                            type="text" 
                            placeholder='Username'
                            pattern="^[\p{L}0-9_\s]{3,25}$"
                            defaultValue={data.name}
                            minLength={3}
                            maxLength={25}
                        />
                        {errors.name && <p className='error'>{errors.name}</p>}
                    </div>

                    <div>
                        <label>Email Address</label>
                        <input 
                            ref={email} 
                            type="email" 
                            placeholder='Email Address'
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$"
                            defaultValue={data.email}
                            maxLength={320}
                        />
                        {errors.email && <p className='error'>{errors.email}</p>}
                    </div>

                    <div>
                        <label>Password</label>
                        <input 
                            ref={password} 
                            type="password" 
                            placeholder='Password'
                            pattern="^(?=.*[A-Za-z])(?=.*\d).{6,}$"
                            minLength={6}
                        />
                        {errors.password && <p className='error'>{errors.password}</p>}
                    </div>

                    {errors.unkown && <p className='error'>{errors.unkown}</p>}

                    <button type="submit" disabled={isSubmitting} onClick={UpdateUserInfo}>
                        {isSubmitting ? "Loading..." : "Update Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}