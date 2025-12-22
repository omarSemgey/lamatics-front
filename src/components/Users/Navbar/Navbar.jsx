import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import useThemeSwitch from '../../../hooks/useThemeSwitch';
import useGetUserRole from '../../../hooks/useGetUserRole';

export default function Navbar(){
    const navigate = useNavigate();

    const header = useRef(null);
    const search = useRef();

    const {role} = useGetUserRole();

    const [isNavOpen, setIsNavOpen] = useState(false);

    function toggleNav()  {
        setIsNavOpen(!isNavOpen);
    }

    function handleSearch(event){
        event.preventDefault();
        if(search.current.value !== '') navigate(`/quizzes/search/${search.current.value}`)
    }

    return (
        <>
            <button className="mobile-nav-toggle" onClick={toggleNav}>
                ☰
            </button>
            <div ref={header} className={`navbar ${isNavOpen ? 'active' : ''}`}>
                <div className='logo'>
                    <h2>
                        <Link
                        onClick={toggleNav}
                        to='/'>Lamatics
                        </Link>
                    </h2>
                </div>
                <ul className='links'>
                    <li className='link search'>
                        <form action="" onSubmit={(event) => {handleSearch(event); toggleNav}}>
                            <input ref={search} type="text" placeholder='Search for a quiz...'/>
                            <FontAwesomeIcon icon={faSearch} className='icon'></FontAwesomeIcon>
                        </form>
                    </li>
                    <li className='link'>
                        <Link 
                        onClick={toggleNav}
                        to={role == 1 ? '/quizzes' : '/'}>
                            Quizzes
                        </Link>
                    </li>
                    <li className='link theme' onClick={() => {useThemeSwitch()}}>
                        <FontAwesomeIcon className='icon moon' icon={faMoon}></FontAwesomeIcon>
                        <FontAwesomeIcon className='icon sun' icon={faSun}></FontAwesomeIcon>
                    </li>
                    <li className='link icon'>
                        <Link
                        onClick={toggleNav}
                        to={role == 1 ? '/profile' : '/login'}>
                            <FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}