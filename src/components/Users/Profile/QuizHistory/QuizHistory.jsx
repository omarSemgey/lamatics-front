import { useEffect, useRef, useState } from 'react';
import './QuizHistory.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Loading from '../../../Loading/Loading';
import Pagination from '../../../Pagination/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function QuizHistory({ mode }){
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
        const fetchSubmissions = async () => {
            await axios.get(`/submissions`,{
                params : { page : params.page || 1 }
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
            })
        };

        const fetchSearchSubmissions = async () => {
            await axios.get(`/submissions/search`, {
                params : {
                    search : params.search,
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
                setIsLoading(false); 
            })
            .catch (() => {
                setSearchError(true);
            })
        };

        if(mode == 'list'){
            fetchSubmissions();
        }else{
            fetchSearchSubmissions();
        }
    },[mode, params]);

    if (isLoading) {
        return <Loading></Loading>;
    }

    if(error){
        return (
            <>
            <div className='quiz-history empty'>
                <h1>لم يتم اتمام اي امتحان من قبل</h1>
                <p>ابدا باخذ الامتحانات</p>
                <Link to={`/quizzes`}>الصفحة الرئيسية</Link>
        </div>
            </>
        )
    }

    if(searchError){
        return (
            <>
            <div className='search-page empty'>
                <h1>لم يتم العثور على اي نتائج</h1>
                <p>حاول التاكد من اسم الاختبار والمحاولة مرة اخرى</p>
                <Link to={`/profile/history`}>ارجع الى الصفحة الرئيسية</Link>
        </div>
            </>
        )
    }

    function handleDifficultyClass(difficulty){
        if(difficulty == 1){
            return 'Easy'
        }else if(difficulty == 2){
            return 'Medium'
        }else{
            return 'Hard'
        }
    }

    function handleScoreClass(score){
        if(score > 75){
            return 'good'
        }else if(score >= 50 && score < 75){
            return 'medium'
        }else{
            return 'bad'
        }
    }

    function handleDifficulty(difficulty){
        if(difficulty == 1){
            return 'سهل'
        }else if(difficulty == 2){
            return 'متوسط'
        }else{
            return 'صعب'
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
        if(search.current.value !== '') navigate(`/profile/history/search/${search.current.value}`)
    }

    return(
        <>
        <div className='quiz-history'>
        <h2 className='header'>سجل الامتحانات</h2>
        <div className="page-header">
            <div className='search'>
                <form action="" onSubmit={(event)=>handleSearch(event)}>
                    <input ref={search} type="text" placeholder='أبحث عن امتحان...'/>
                    <FontAwesomeIcon icon={faSearch} className='icon'></FontAwesomeIcon>
                </form>
            </div>
            <select onChange={handleSort} ref={sort} className='sort'>
                <option value="1">ترتيب تصاعدي حسب الابجدية</option>
                <option value="2">ترتيب تنازلي حسب الابجدية</option>
                <option value="3">ترتيب تصاعدي حسب النتيجة</option>
                <option value="4">ترتيب تنازلي حسب النتيجة</option>
            </select>
        </div>
        {submissions?.map((data) => (
            <Link key={data.quiz.quiz_id} to={`/quizzes/results/${data.quiz.quiz_id}`}>
                <div className='quiz-card'>
                <p className='quiz-title'>{data.quiz.quiz_title}</p>
                <p className='quiz-description'>{data.quiz.quiz_description}</p>
                <div className="quiz-details">
                <div className="detail-item">
                    <strong>الصعوبة : </strong>
                    <span className={`difficulty ${handleDifficultyClass(data.quiz.quiz_difficulty).toLowerCase()}`}>{handleDifficulty(data.quiz.quiz_difficulty)}</span>
                </div>
                <div className="detail-item">
                    <strong>عدد الاسئلة : </strong>
                    <span className="questions-count">{data.quiz.quiz_questions_count}</span>
                </div>
                <div className="detail-item">
                    <strong>النتيجة : </strong>
                    <span className={`score ${handleScoreClass(data.score)}`}>%{data.score}</span>
                </div>
                </div>
                </div>
            </Link>
        ))}
        </div>
        {
            isPagination &&
            <Pagination 
                path={mode == 'list' ? `/profile/history` : `/profile/history/search/${params.search}`} 
                page={params.page} 
                lastPage={lastPage}
            />
        }
        </>
    )
}
