import './ShowUserSubmissions.css'
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Loading from '../../../../Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../../Pagination/Pagination';

export default function ShowUserSubmissions({ mode }){
    const [submissions, setSubmissions] = useState([]); 
    const [lastPage, setLastPage] = useState(1);
    const [isPagination, setisPagination] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 
    const [error,setError] = useState(false);
    const [searchError,setSearchError] = useState(false);

    const navigate = useNavigate();

    const sort = useRef();
    const search = useRef();
    const params = useParams();

    useEffect(() => {
        setError(false);
        setSearchError(false);
        const fetchSubmissions = async () => {
            await axios.get(`/submissions`,{
                params: {
                    user_id : params.user,
                    page : params.page || 1
                }
            })
            .then((response) => {
                if(response.data.submissions.data.length == 0){
                    setError(true);
                    setIsLoading(false);
                    return;
                }
                setSubmissions(response.data.submissions.data);
                setLastPage(response.data.submissions.last_page);
                if (response.data.submissions.total > 10) setisPagination(true);
                setIsLoading(false);
            }).catch(() => {
                setError(true);
                setIsLoading(false);
            })
        };

        const fetchSearchSubnissions = async () => {
            await axios.get(`/submissions/search/`, {
                params : {
                    search : params.search,
                    user_id : params.user,
                    page : params.page || 1
                }
            })
            .then((response) => {
                if(response.data.submissions.data.length == 0){
                    setSearchError(true);
                    setIsLoading(false);
                    return;
                }
                setSubmissions(response.data.submissions.data);
                setLastPage(response.data.submissions.last_page);
                if (response.data.submissions.total > 10) setisPagination(true);
                setIsLoading(false);
            }).catch(() => {
                setSearchError(true);
                setIsLoading(false);
            })
        };

        if(mode == 'list'){
            fetchSubmissions();
        }else{
            fetchSearchSubnissions();
        }
    },[mode, params])

    if (isLoading) {
        return <Loading></Loading>;
    }

    if(error){
        return (
            <>
            <div className='quiz-history empty'>
                <h1>No quizzes were taken</h1>
                <p>This user didnt submit to any quiz.</p>
            </div>
            </>
        )
    }

    if(searchError){
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
                <h1>No submissions were found</h1>
                <p>please try checking the quiz title and try again</p>
                <Link to={`/dashboard/users/${params.user}/submissions`}>Submission list</Link>
            </div>
            </>
        )
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

    function handleSort() {
        setSubmissions(prev => {
        const sorted = [...prev];
        const sortValue = sort.current.value;

        if (sortValue === '1') {
            sorted.sort((a, b) => 
                a.quiz.quiz_title.localeCompare(b.quiz.quiz_title)
            );
        } else if (sortValue === '2') {
            sorted.sort((a, b) => 
                b.quiz.quiz_title.localeCompare(a.quiz.quiz_title)
            );
        } else if (sortValue === '3') {
            sorted.sort((a, b) => 
            a.score - b.score
            );
        } else if (sortValue === '4') {
            sorted.sort((a, b) => 
                b.score - a.score
            );
        }

        return sorted;
        });
    }

    function handleSearch(event){
        event.preventDefault();
        if(search.current.value !== ''){
            navigate(`/dashboard/users/${params.user}/submissions/search/${search.current.value}`)
        } 
    }

    return(
        <>
        <div className='show-user-submissions'>
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
                <option value="3">Sort by lowest score</option>
                <option value="4">Sort by highest score</option>
            </select>
        </div>
        <h3 className="count">
            Showing {submissions.length} Submissions from {submissions.total}
        </h3>
        <table>
            <thead>
                <tr>
                    <th className="info-title">Title</th>
                    <th className="description">Description</th>
                    <th className="info-count">Question count</th>
                    <th className="defficulty">Defficulty</th>
                    <th className="score">Score</th>
                </tr>
            </thead>
            <tbody>
                {submissions.map((data) => {
                    return (
                        <tr key={data.quiz.quiz_id}>
                            <td data-info="Title:" className="info-title">
                                <Link to={`/dashboard/users/${params.user}/results/${data.quiz.quiz_id}`}>{data.quiz.quiz_title}</Link>
                            </td>
                            <td data-info="Description:" className="description">
                                {data.quiz.quiz_description}
                            </td>
                            <td  data-info="Question count:"className="info-count">
                                {data.quiz.quiz_questions_count}
                            </td>
                            <td  data-info="Quiz defficulty:"className="defficulty">
                                {handleDifficulty(data.quiz.quiz_difficulty)}
                            </td>
                            <td data-info="Score:" className={`score`}>
                                {data.score}%
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        {
            isPagination &&
            <Pagination 
                path={mode == 'list' ? `/dashboard/users/show/${params.user}` : `/dashboard/users/show/${params.user}/search/${params.search}`} 
                page={params.page} 
                lastPage={lastPage}
            />
        }
        </div>
        </>
    )
}