import './LeftNav.css';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faMoon, faSignOutAlt, faSun } from '@fortawesome/free-solid-svg-icons';
import useThemeSwitch from '../../../hooks/useThemeSwitch';
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';

export default function LeftNav() {
    const navigate= useNavigate();

    const quizzes = useRef();
    const users = useRef();

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    function toggleNav()  {
        setIsNavOpen(!isNavOpen);
    }

    function handleCategories(event){
        const condition = document.querySelector('.leftnav-item.active') == event.current;
        if(document.querySelector('.leftnav-item.active')) document.querySelector('.leftnav-item.active').classList.remove('active');
        if(!condition) event.current.classList.add('active');
    }

    function handleCatOption(event){
        if(!event.target.classList.contains('active')){
            if(document.querySelector('.cat-option.active')) document.querySelector('.cat-option.active').classList.remove('active');
            event.target.classList.add('active')
        }
    }

    function handleLogout(){
        setIsLoggingOut(true);
    }

    async function handleLogoutConfirm(){
        axios.post('/auth/logout')
        .then(() => {
            // Deleting tokens is handled by the backend
            localStorage.removeItem('isAuthenticated')
            setIsLoggingOut(false);
            navigate('/');
        });
    }

    function handleLogoutCancel(){
        setIsLoggingOut(false);
    }

    return(
        <>
        <button className="mobile-nav-toggle" onClick={toggleNav}>
            ☰
        </button>
        <div className={`left-nav ${isNavOpen ? 'active' : ''}`}>
            <div className='nav-container'>
                <h6 className='header'>Lamatecs</h6>
                <ul>
                    <li ref={quizzes} className='leftnav-item'>
                        <span className='category' onClick={()=>{handleCategories(quizzes)}}>
                        <span>Quizzes</span>
                        <FontAwesomeIcon icon={faAngleLeft} className='arrow'></FontAwesomeIcon> 
                        </span>
                        <ul className='category-options'>

                            <li>
                                <Link to={`/dashboard/quizzes`} className='cat-option' onClick={(event)=>{handleCatOption(event)}}>
                                    Quizzes List
                                </Link>
                            </li>

                            <li>
                                <Link to={`/dashboard/quizzes/create`} className='cat-option' onClick={(event)=>{handleCatOption(event)}}>
                                    Create Quiz
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li ref={users} className='leftnav-item'>    
                        <span className='category' onClick={()=>{handleCategories(users)}}>
                        <span>Users</span>
                        <FontAwesomeIcon icon={faAngleLeft} className='arrow'></FontAwesomeIcon> 
                        </span>
                        <ul className='category-options'>
                            <li>
                                <Link to={`/dashboard/users`} className='cat-option' onClick={(event)=>{handleCatOption(event)}}>
                                    Users list
                                </Link>
                            </li>
                            <li>
                                <Link to={`/dashboard/users/create`} className='cat-option' onClick={(event)=>{handleCatOption(event)}}>
                                    Create User
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className='leftnav-item theme'>
                        <span className='category' onClick={useThemeSwitch}>
                            <FontAwesomeIcon className='icon moon' icon={faMoon}></FontAwesomeIcon>
                            <FontAwesomeIcon className='icon sun' icon={faSun}></FontAwesomeIcon>
                        </span>
                    </li>
                    <li className='leftnav-item log-out'>
                        <span className='category' onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className='icon'></FontAwesomeIcon> 
                        <span className='link-title'>Logout</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <ConfirmationModal
            isOpen={isLoggingOut}
            onClose={handleLogoutCancel}
            onConfirm={handleLogoutConfirm}
            message="Are you sure you want to log out?"
        />
        </>
    )
}