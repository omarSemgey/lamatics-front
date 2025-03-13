import './Error.css';
import { Link } from 'react-router-dom';

export default function Error(){
    const role = localStorage.getItem('role');
    return(
        <>
        <div className='page-error'>
            <h1>404 Page Not Found.</h1>
            <button><Link to={role > 1 ? '/dashboard' : '/'}>Return to home</Link></button>
        </div>
        </>
    )
}