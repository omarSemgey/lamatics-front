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
        }).finally(()=>{
            setIsSubmitting(false)
        })
    }

    return(
        <>
            <div className='header'>
                <h1>تسجيل دخول</h1>
                <span> سجل دخول او <Link to={'/signup'}> انشئ حساب </Link> </span>
            </div>

            <form>
                <div>
                    <label>عنوان البريد الالكتروني</label>
                    <input 
                        required
                        ref={email} 
                        type="email" 
                        placeholder='عنوان البريد الالكتروني'
                        pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$"
                        maxLength={320}
                    />
                    { emailError && <p className='error'> يرجى إدخال عنوان بريد إلكتروني صالح (حد أقصى 320 حرفًا) </p> }
                </div>

                <div>
                    <label>كلمة المرور</label>
                    <input 
                        required
                        ref={password} 
                        type="password" 
                        placeholder='كلمة المرور'
                        pattern="^(?=.*[A-Za-z])(?=.*\d).{6,}$"
                        minLength={6}
                    />
                    { passwordError && <p className='error'> كلمة المرور يجب أن تحتوي على الأقل على 6 أحرف </p> }
                    { notFoundError && <p className='error'> كلمة المرور او عنوان البريد الالكتروني غير صحيح </p> }
                </div>

                <button type="submit" disabled={isSubmitting} onClick={login}>تسجيل دخول</button>
            </form>
        </>
    )
}