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
            required: 'حقل الاسم مطلوب',
            min: 'الحد الأدنى للاسم ٣ أحرف',
            max: 'الحد الأقصى للاسم ٢٥ حرفاً',
            regex: 'يسمح فقط بالأحرف (من أي لغة)، الأرقام، المسافات، والشرطة السفلية (_). غير مسموح بالأحرف الخاصة أو الرموز الأخرى',
            unique: 'الاسم مستخدم من قبل',
            invalid: 'صيغة الاسم غير صحيحة'
        },
        email: {
            required: 'حقل البريد الإلكتروني مطلوب',
            email: 'صيغة البريد الإلكتروني غير صحيحة',
            max: 'الحد الأقصى للبريد الإلكتروني ٣٢٠ حرفاً',
            regex: 'يرجى إدخال بريد إلكتروني صحيح (مثال: example@domain.com)',
            unique: 'البريد الإلكتروني مستخدم من قبل'
        },
        password: {
            required: 'حقل كلمة المرور مطلوب',
            min: 'الحد الأدنى لكلمة المرور ٦ أحرف',
            regex: 'يجب أن تحتوي كلمة المرور على حرف إنجليزي ورقم واحد على الأقل',
            invalid: 'صيغة كلمة المرور غير صحيحة'
        },
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
            }
        }).finally(()=>{
            setIsSubmitting(false)
        })
    }

    return(
        <>
            <div className='header'>
                <h1>إنشاء حساب</h1>
                <span> انشئ حساب او <Link to={'/login'}>سجل الدخول </Link></span>
            </div>

            <form>
                <div>
                    <label>اسم المستخدم</label>
                    <input 
                        required
                        ref={name} 
                        type="text" 
                        placeholder='اسم المستخدم'
                        pattern="^[\p{L}0-9_\s]{3,25}$"
                        minLength={3}
                        maxLength={25}
                    />
                    {errors.name && <p className='error'>{errors.name}</p>}
                </div>

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
                    {errors.email && <p className='error'>{errors.email}</p>}
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
                    {errors.password && <p className='error'>{errors.password}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} onClick={register}>إنشاء حساب</button>
            </form>
        </>
    )
}