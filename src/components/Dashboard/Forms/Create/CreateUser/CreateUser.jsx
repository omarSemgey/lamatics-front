import '../../Form.css';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateUser() {
    const navigate = useNavigate();

    const name = useRef();
    const email = useRef();
    const password = useRef();

    const [isAdmin, setIsAdmin] = useState(false);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleUserCreation(event) {
        event.preventDefault();
        setIsSubmitting(true)
        setErrors({})

        axios.post(`/users`, {
            name: name.current.value,
            email: email.current.value,
            password: password.current.value,
            role: isAdmin ? 2 : 1,
        })
        .then(() => {
            navigate('/dashboard/users');
        }).catch(error => {
            if (error.response?.data?.errors) {
                const formattedErrors = {};
                Object.entries(error.response.data.errors).forEach(([key, value]) => {
                    formattedErrors[key] = value[0]; 
                });
                setErrors(formattedErrors);
            }
        }).finally(()=>{
            setIsSubmitting(false)
        })
    }

    return (
        <>
            <div className='form'>
                <div className='container'>
                    <div className='header'>
                        <h1>Create user</h1>
                    </div>

                    <form>
                        <div>
                            <label>Username</label>
                            <input 
                                ref={name} 
                                type="text" 
                                placeholder='Enter username' 
                                pattern="^[\p{L}0-9_\s]{3,25}$"
                                minLength={3}
                                maxLength={25} 
                                required
                            />
                            {errors['name'] && <p className='error'>{errors['name']}</p>}
                        </div>

                        <div>
                            <label>Email</label>
                            <input 
                                ref={email} 
                                type="text" 
                                placeholder='Enter email' 
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" 
                                maxLength={320} 
                                required
                            />
                            {errors['email'] && <p className='error'>{errors['email']}</p>}
                        </div>

                        <div>
                            <label>Password</label>
                            <input 
                                ref={password} 
                                type="password" 
                                placeholder='Enter password' 
                                pattern="^(?=.*[A-Za-z])(?=.*\d).{6,}$"
                                minLength={3}
                                maxLength={25}                        
                                required
                            />
                            {errors['password'] && <p className='error'>{errors['password']}</p>}
                        </div>

                        <div>
                            <label>
                                <span>Is Admin</span>
                                <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}/>
                            </label>
                        </div>

                        <button type='submit' disabled={isSubmitting} onClick={(event) => handleUserCreation(event)}>
                            {
                                isSubmitting ?
                                "Loading..." :
                                "Create User" 
                            }
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}