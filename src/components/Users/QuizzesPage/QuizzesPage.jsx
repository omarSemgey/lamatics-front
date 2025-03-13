import axios from "axios";
import "./QuizzesPage.css";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../Loading/Loading";
import Pagination from "../../Pagination/Pagination";

export default function QuizzesPage({mode}) {
    const sort = useRef();
    const[quizzes,setQuizzes] = useState([]);
    const[lastPage,setLastPage] = useState(1);
    const[IsPagination,setIsPagination] = useState(false);
    const [error,setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();

    useEffect(()=>{
        setIsLoading(true);
        setError(false);
        const fetchQuizzes = async () => {
            await axios.get(`/quizzes`,{
                params : { page : params.page || 1 }
            })
            .then((response) => {
                setQuizzes(response.data.quizzes.data);
                setLastPage(response.data.quizzes.last_page);
                if(response.data.quizzes.total > 10) setIsPagination(true)
                setIsLoading(false);
            });
        };

        const fetchSearchQuizzes = async () => {
            await axios.get(`/quizzes/search`, {
                params: { 
                    search: params.search,
                    page : params.page || 1
                },
            })
            .then((response) => {
                if(response.data.quizzes.data == 0){
                    setError(true);
                    return;
                }
                setQuizzes(response.data.quizzes.data);
            }).catch(() => {
                setError(true); 
            }).finally(() => {
                setIsLoading(false); 
            });
        }
        if(mode == 'list'){
            fetchQuizzes();
        }else{
            fetchSearchQuizzes();
        }
    },[params,mode]);

    function handleFifficulty(difficulty){
        if(difficulty == 1){
            return 'Easy'
        }else if(difficulty == 2){
            return 'Medium'
        }else{
            return 'Hard'
        }
    }

    function handleSort(){
        if(sort.current.value == 1 ) setQuizzes([...quizzes.sort((p1, p2) => {return p1.quiz_title < p2.quiz_title ? -1 : 1;})]);
        if(sort.current.value == 2 )  setQuizzes([...quizzes.sort((p1, p2) => {return p1.quiz_title > p2.quiz_title ? -1 : 1;})]);

        if(sort.current.value == 3 ) setQuizzes([...quizzes.sort((p1, p2) => {return p1.quiz_difficulty < p2.quiz_difficulty ? -1 : 1;})]);
        if(sort.current.value == 4 ) setQuizzes([...quizzes.sort((p1, p2) => {return p1.quiz_difficulty > p2.quiz_difficulty ? -1 : 1;})]);
    }

    if(isLoading){
        return <Loading></Loading>
    }

    if(error){
        return (
            <>
            <div className='search-page empty'>
                <h1>لم يتم العثور على اي نتائج</h1>
                <p>حاول التاكد من اسم الاختبار والمحاولة مرة اخرى</p>
                <Link to={`/quizzes`}>ارجع الى الصفحة الرئيسية</Link>
        </div>
            </>
        )
    }

    return (
        <>
        <div className="quizzes-page">
        <div className="page-header">
            <h1 className="page-title">الأمتحانات</h1>
            <select onChange={handleSort} ref={sort} className='sort'>
                <option value="1">ترتيب تصاعدي حسب الابجدية</option>
                <option value="2">ترتيب تنازلي حسب الابجدية</option>
                <option value="3">ترتيب من الاقل صعوبة</option>
                <option value="4">ترتيب من الاعلى صعوبة</option>
            </select>
        </div>
        {quizzes.map((quiz) => (
        <Link key={quiz.quiz_id} to={`/quizzes/show/${quiz.quiz_id}`}>
            <div className={`quiz-container ${handleFifficulty(quiz.quiz_difficulty).toLowerCase()}`}>
                <div className='difficulty-circle'>{handleFifficulty(quiz.quiz_difficulty)}</div>
                <div className="quiz-details">
                    <h3 className="quiz-title">{quiz.quiz_title}</h3>
                    <p className="quiz-description">{quiz.quiz_description}</p>
                </div>
            </div>
        </Link>
        ))}
        </div>
        {
            IsPagination &&
            <Pagination
                path={mode == 'list' ? '/quizzes' : `/quizzes/search/${params.search}`} 
                page={params.page} 
                lastPage={lastPage}
            ></Pagination>
        }
        </>
    );
}

