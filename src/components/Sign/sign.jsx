import { useNavigate } from 'react-router-dom';
import useGetUserRole from '../../hooks/useGetUserRole';
import Login from './Login/Login'
import './sign.css'
import Signup from './Signup/Signup'
import Loading from '../Loading/Loading';


export default function Sign({mode}){
    const {role, isLoading} = useGetUserRole();
    const navigate = useNavigate();

    if (isLoading) {
        return <Loading></Loading>; 
    }

    if(role > 1){
        navigate('/dashboard');
    }else if(role == 1){
        navigate('/quizzes')
    }


    return(
        <>
            <div className='sign'>
                <div className='container'>
                    {mode == 'login' ? <Login></Login> : <Signup></Signup>}
                </div>
            </div>
        </>
    )
}