import '../../Form.css'
import Loading from '../../../../Loading/Loading';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function UpdateUser(){

    const navigate= useNavigate();

    const name = useRef();
    const email = useRef();
    const password = useRef();

    const [errors, setErrors] = useState({});

    const id = useParams();
    const [data,setData] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
        await axios.get(`/users/${id.user}`)
        .then((response) => {
        setData(response.data.user);
        setIsLoading(false);
        });
        };

        fetchUser();
    },[id]);

    if (isLoading) {
        return <Loading></Loading>;
    }

    function UpdateUserInfo(event){
        event.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        const updateData = {};
        if(name.current.value) updateData.name = name.current.value;
        if(email.current.value) updateData.email = email.current.value;
        if(password.current.value) updateData.password = password.current.value;

        axios.put(`/users/${id.user}`, updateData)
        .then(() => {
            navigate('/dashboard/users');
        })
        .catch(error => { 
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

    return(
        <>
        <div className='form'>
            <div className='container'>
                <div className='header'>
                    <h1>Update user</h1>
                </div>

                <form>
                <div>
                    <label>Username</label>
                    <input 
                        ref={name} 
                        type="text" 
                        placeholder='Enter username' 
                        pattern="/^[\p{L}\p{N}\p{S}\p{P}\s]{3,25}$/u"
                        minLength={3}
                        maxLength={25} 
                        defaultValue={data.name}
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
                                defaultValue={data.email}
                            />
                            {errors['email'] && <p className='error'>{errors['email']}</p>}
                        </div>

                        <div>
                            <label>Password</label>
                            <input 
                                ref={password} 
                                type="password" 
                                placeholder='Enter password' 
                                pattern="/^[\p{L}\p{N}\p{S}\p{P}\s]{6,}$/u"
                                minLength={3}
                                maxLength={25}                        
                            />
                            {errors['password'] && <p className='error'>{errors['password']}</p>}
                        </div>

                    <button type='submit' disabled={isSubmitting} onClick={(event)=>UpdateUserInfo(event)}>
                        {
                            isSubmitting ?
                            "Loading..." :
                            "Update user" 
                        }
                    </button>
                </form>
            </div>
        </div>
        </>
    )
}