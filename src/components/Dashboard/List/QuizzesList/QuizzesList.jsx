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

export default function QuizzesList({mode}) {
    const [data, setData] = useState({});
    const [count, setCount] = useState(0);
    const [error,setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastPage, setLastPage] = useState(1);
    const [isPagination, setisPagination] = useState(false);
    const [update, setUpdate] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);

    const sort = useRef();
    const search = useRef();

    const params = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const fetchQuizzes = async () => {
            await axios.get(`/quizzes`,{
                params: { page : params.page || 1 }
            })
                .then((response) => {
                    setData(response.data.quizzes.data);
                    setLastPage(response.data.quizzes.last_page);
                    setCount(response.data.quizzes.total);
                    if (response.data.quizzes.total > 10) setisPagination(true);
                    setIsLoading(false);
                });
        };

        const fetchSearchQuizzes = async () => {
            axios.get(`/quizzes/search`, {
                params: { 
                    search: params.seach,
                    page : params.page || 1
                },
            })
            .then((response) => {
                if(response.data.quizzes.data.length == 0 ){
                    setError(true);
                    setIsLoading(false);
                    return;
                }
                setData(response.data.quizzes.data);
                setLastPage(response.data.quizzes.last_page);
                setCount(response.data.quizzes.total);
                if (response.data.quizzes.total > 10) setisPagination(true);
                setIsLoading(false);
            }).catch(() => {
                setError(true); 
                setIsLoading(false); 
            })
        }

        if(mode == 'list'){
            fetchQuizzes();
        }else{
            fetchSearchQuizzes();
        }
    }, [params, update, mode]);

    function handleDeleteClick(id){
        setQuizToDelete(id);
        setIsModalOpen(true);
    }

    async function handleDeleteConfirm(){
        if (quizToDelete) {
            await axios.delete(`/quizzes/${quizToDelete}`)
            .then(()=>{
                setUpdate(update + 1);
            })
        }
        setIsModalOpen(false);
        setQuizToDelete(null); 
    }

    function handleDeleteCancel(){
        setIsModalOpen(false);
        setQuizToDelete(null);
    }

    function handleDifficulty(difficulty){
        if(difficulty == 1){
            return 'Easy'
        }else if(difficulty == 2){
            return 'Medium'
        }else{
            return 'Hard'
        }
    }

    function handleSort(){
        if(sort.current.value == 1 ) setData([...data.sort((p1, p2) => {return p1.quiz_title < p2.quiz_title ? -1 : 1;})]);
        if(sort.current.value == 2 )  setData([...data.sort((p1, p2) => {return p1.quiz_title > p2.quiz_title ? -1 : 1;})]);

        if(sort.current.value == 3 ) setData([...data.sort((p1, p2) => {return p1.quiz_difficulty < p2.quiz_difficulty ? -1 : 1;})]);
        if(sort.current.value == 4 ) setData([...data.sort((p1, p2) => {return p1.quiz_difficulty > p2.quiz_difficulty ? -1 : 1;})]);
    }

    function handleSearch(event){
        event.preventDefault();
        if(search.current.value !== '') navigate(`/dashboard/quizzes/search/${search.current.value}`)
    }

    if(error){
        return (
            <>
            <div className='table'>
                <div className="page-header">
                    <div className='search'>
                        <form action="" onSubmit={(event)=>handleSearch(event)}>
                            <input ref={search} type="text" placeholder='Search for a quiz...'/>
                            <FontAwesomeIcon icon={faSearch} className='icon'></FontAwesomeIcon>
                        </form>
                    </div>
                </div>
            </div>
            <div className='search-page empty'>
                <h1>No quiz were found</h1>
                <p>please try checking the quiz title and try again</p>
                <Link to={`/dashboard/quizzes`}>Quizzes list</Link>
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
                        <input ref={search} type="text" placeholder='Search for a quiz...'/>
                        <FontAwesomeIcon icon={faSearch} className='icon'></FontAwesomeIcon>
                    </form>
                </div>
                <select onChange={handleSort} ref={sort} className='sort'>
                    <option value="1">Sort from A to Z</option>
                    <option value="2">Sort from Z to A</option>
                    <option value="3">Sort by lowest price</option>
                    <option value="4">Sort by highest price</option>
                </select>
            </div>
            <h3 className="count">
                Showing {data.length} Quizzes from {count}
            </h3>
            <table>
                <thead>
                    <tr>
                        <th className="info-title">Title</th>
                        <th className="description">Description</th>
                        <th className="info-count">Question count</th>
                        <th className="difficulty">difficulty</th>
                        <th className="actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((quiz) => {
                        return (
                            <tr key={quiz.quiz_id}>
                                <td data-info="Title:" className="info-title"><Link to={`/dashboard/quizzes/show/${quiz.quiz_id}`}>{quiz.quiz_title}</Link></td>
                                <td data-info="Description:" className="description">{quiz.quiz_description}</td>
                                <td  data-info="Question count:"className="info-count">{quiz.quiz_questions_count}</td>
                                <td  data-info="Quiz difficulty:"className="difficulty">{handleDifficulty(quiz.quiz_difficulty)}</td>
                                <td data-info="Actions:" className="actions">
                                    <div className="icons-wrapper">
                                        <Link to={`/dashboard/quizzes/update/${quiz.quiz_id}`}>
                                            <FontAwesomeIcon icon={faEdit} className="icon edit"></FontAwesomeIcon>
                                        </Link>
                                        <Link onClick={() => handleDeleteClick(quiz.quiz_id)}>
                                            <FontAwesomeIcon icon={faTrashAlt} className="icon delete"></FontAwesomeIcon>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        {
            isPagination &&
            <Pagination 
                path={mode == 'list' ? '/dashboard/quizzes' : `/dashboard/quizzes/search/${params.search}`} 
                page={params.page} 
                lastPage={lastPage}
            />
        }
        <ConfirmationModal
            isOpen={isModalOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            message="Are you sure you want to delete this quiz?"
        />
        </>
    );
}   