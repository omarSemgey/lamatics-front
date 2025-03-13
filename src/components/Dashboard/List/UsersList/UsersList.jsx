import '../table.css'

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Loading from '../../../Loading/Loading';
import ConfirmationModal from '../../../ConfirmationModal/ConfirmationModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../Pagination/Pagination';

export default function UsersList({mode}) {
    const [data, setData] = useState({});
    const [count, setCount] = useState(0);
    const [error,setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastPage, setLastPage] = useState(1);
    const [isPagination, setisPagination] = useState(false);
    const [update, setUpdate] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const sort = useRef();
    const search = useRef();
    const params = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        const fetchUsers = async () => {
            await axios.get(`/users`,{
                params : { page : params.page || 1 }
            })
            .then((response) => {
                setData(response.data.users.data);
                setLastPage(response.data.users.last_page);
                setCount(response.data.users.total);
                if (response.data.users.total > 10) setisPagination(true);
                setIsLoading(false);
            });
        };

        const fetchUserSearch = async () => {
            await axios.get(`/users/search`, {
                params: { 
                    search: params.search,
                    page : params.page || 1
                },
            })
            .then((response) => {
                if(response.data.users.data.length == 0 ){
                    setError(true);
                    setIsLoading(false);
                    return;
                }
                setData(response.data.users.data);
                setLastPage(response.data.users.last_page);
                setCount(response.data.users.total);
                if (response.data.users.total > 10) setisPagination(true);
                setIsLoading(false);
            }).catch(() => {
                setError(true); 
                setIsLoading(false);
            });
        };

        if(mode == 'list'){
            fetchUsers();
        }else{
            fetchUserSearch();
        }
    }, [params, update, mode]);

    function handleDeleteClick(id){
        setUserToDelete(id);
        setIsModalOpen(true);
    }

    async function handleDeleteConfirm(){
        if (userToDelete) {
            await axios.delete(`/users/${userToDelete}`)
            .then(()=>{
                setUpdate(update + 1);
            })
        }
        setIsModalOpen(false);
        setUserToDelete(null); 
    }

    function handleDeleteCancel(){
        setIsModalOpen(false);
        setUserToDelete(null);
    }

    function handleSort(){
        if(sort.current.value == 1 ) setData([...data.sort((p1, p2) => {return p1.name < p2.name ? -1 : 1;})]);
        if(sort.current.value == 2 )  setData([...data.sort((p1, p2) => {return p1.name > p2.name ? -1 : 1;})]);

        if(sort.current.value == 3 ) setData([...data.sort((p1, p2) => {return p1.user_submissions_count < p2.user_submissions_count ? -1 : 1;})]);
        if(sort.current.value == 4 ) setData([...data.sort((p1, p2) => {return p1.user_submissions_count > p2.user_submissions_count ? -1 : 1;})]);
    }

    function handleSearch(event){
        event.preventDefault();
        if(search.current.value !== '') navigate(`/dashboard/users/search/${search.current.value}`)
    }

    if(error){
        return (
            <>
            <div className='table'>
                <div className="page-header">
                    <div className='search'>
                        <form action="" onSubmit={(event)=>handleSearch(event)}>
                            <input ref={search} type="text" placeholder='Search for a user...'/>
                            <FontAwesomeIcon icon={faSearch} className='icon'></FontAwesomeIcon>
                        </form>
                    </div>
                </div>
            </div>
            <div className='search-page empty'>
                <h1>No users were found</h1>
                <p>please try checking the name and try again</p>
                <Link to={`/dashboard/users`}>Users list</Link>
            </div>
            </>
        )
    }

    if (isLoading) {
        return <Loading></Loading>;
    }

    return (
        <>
        <div className="table users-table">
            <div className="page-header">
                <div className='search'>
                    <form action="" onSubmit={(event)=>handleSearch(event)}>
                        <input ref={search} type="text" placeholder='Search for a user...'/>
                        <FontAwesomeIcon icon={faSearch} className='icon'></FontAwesomeIcon>
                    </form>
                </div>
                <select onChange={handleSort} ref={sort} className='sort'>
                    <option value="1">Sort from A to Z</option>
                    <option value="2">Sort from Z to A</option>
                    <option value="3">Sort by lowest submission</option>
                    <option value="4">Sort by highest submission</option>
                </select>
            </div>
            <h3 className="count">
                Showing {data.length} Users from {count}
            </h3>
            <table>
                <thead>
                    <tr>
                        <th className="info-title">Username</th>
                        <th className="email">Email</th>
                        <th className="info-count">Quizzes submission</th>
                        <th className="actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) =>  (
                        <tr key={user.user_id}>
                            <td data-info="Username:" className="info-title"><Link to={`/dashboard/users/show/${user.user_id}`}>{user.name}</Link></td>
                            <td data-info="Email:" className="email">{user.email}</td>
                            <td data-info="Quizzes submission:" className="info-count">
                                {user.user_submissions_count}
                            </td>
                            <td data-info="Actions:" className="actions">
                                <div className="icons-wrapper">
                                    <Link to={`/dashboard/users/update/${user.user_id}`}>
                                        <FontAwesomeIcon icon={faEdit} className="icon edit"></FontAwesomeIcon>
                                    </Link>
                                    <Link onClick={() => handleDeleteClick(user.user_id)}>
                                        <FontAwesomeIcon icon={faTrashAlt} className="icon delete"></FontAwesomeIcon>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                        ))}
                </tbody>
            </table>
        </div>
        {
            isPagination &&
            <Pagination 
                path={mode == 'list' ? '/dashboard/users' : `/dashboard/users/search/${params.search}`} 
                page={params.page} 
                lastPage={lastPage}
            />
        }
        <ConfirmationModal
            isOpen={isModalOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            message="Are you sure you want to delete this user?"
        />
        </>
    );
}