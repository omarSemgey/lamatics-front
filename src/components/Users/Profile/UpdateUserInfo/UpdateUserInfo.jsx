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
            required: 'حقل الاسم مطلوب',
            min: 'الحد الأدنى للاسم ٣ أحرف',
            max: 'الحد الأقصى للاسم ٢٥ حرفاً',
            format: 'يجب أن يحتوي الاسم على حرف واحد على الأقل غير المسافة',
            unique: 'الاسم مستخدم من قبل',
            type: 'يجب أن يكون الاسم نصياً'
        },
        email: {
            required: 'حقل البريد الإلكتروني مطلوب',
            email: 'صيغة البريد الإلكتروني غير صحيحة',
            max: 'الحد الأقصى للبريد الإلكتروني ٣٢٠ حرفاً',
            format: 'يجب أن يحتوي البريد الإلكتروني على حرف واحد على الأقل غير المسافة',
            unique: 'البريد الإلكتروني مستخدم من قبل',
            type: 'يجب أن يكون البريد الإلكتروني نصياً'
        },
        password: {
            required: 'حقل كلمة المرور مطلوب',
            min: 'الحد الأدنى لكلمة المرور ٦ أحرف',
            format: 'يجب أن تحتوي كلمة المرور على حرف واحد على الأقل غير المسافة',
            type: 'يجب أن تكون كلمة المرور نصية'
        },
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
                    <h1>تعديل معلومات الحساب الشخصي</h1>
                </div>

                <form>
                    <div>
                        <label>اسم المستخدم</label>
                        <input 
                            ref={name} 
                            type="text" 
                            dir="rtl" 
                            placeholder='اسم المستخدم'
                            pattern="^[\p{L}0-9_\s]{3,25}$"
                            defaultValue={data.name}
                            minLength={3}
                            maxLength={25}
                        />
                        {errors.name && <p className='error'>{errors.name}</p>}
                    </div>

                    <div>
                        <label>عنوان البريد الالكتروني</label>
                        <input 
                            ref={email} 
                            type="email" 
                            placeholder='عنوان البريد الالكتروني'
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$"
                            defaultValue={data.email}
                            maxLength={320}
                        />
                        {errors.email && <p className='error'>{errors.email}</p>}
                    </div>

                    <div>
                        <label>كلمة المرور</label>
                        <input 
                            ref={password} 
                            type="password" 
                            placeholder='كلمة المرور'
                            pattern="^(?=.*[A-Za-z])(?=.*\d).{6,}$"
                            minLength={6}
                        />
                        {errors.password && <p className='error'>{errors.password}</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting} onClick={UpdateUserInfo}>تعديل الحساب</button>
                </form>
            </div>
        </div>
    );
}