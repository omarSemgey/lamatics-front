import './QuizInfo.css'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from "../../Loading/Loading";
import axios from 'axios';

export default function QuizInfo(){
  const quizId = useParams().quiz;
  const [quiz, setQuiz] = useState(null); 
  const [completed, setCompleted] = useState(false); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchQuiz = async () => {
      await axios.get(`/quizzes/${quizId}`)
      .then((response) => {
        setQuiz(response.data.quiz);
        setCompleted(response.data.completed)
        setLoading(false);
      });
    };

    fetchQuiz();
  }, [quizId]);


  if (loading) {
    return <Loading></Loading>;
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

  function handleDifficulty(difficulty){
    if(difficulty == 1){
        return 'سهل'
    }else if(difficulty == 2){
        return 'متوسط'
    }else{
        return 'صعب'
    }
  }

  return (
    <>
      <div className="quiz-info-container">
        <div className="quiz-info-card">
          <h1 className="quiz-title">{quiz.quiz_title}</h1>
          <p className="quiz-description">{quiz.quiz_description}</p>
          <div className="quiz-details">
            <div className="detail-item">
              <strong>الصعوبة : </strong>
              <span className={`difficulty ${handleDifficultyClass(quiz.quiz_difficulty).toLowerCase()}`}>{handleDifficulty(quiz.quiz_difficulty)}</span>
            </div>
            <div className="detail-item">
              <strong>عدد الاسئلة : </strong> 
              <span className="questions-count">{quiz.quiz_questions.length}</span>
            </div>
            <div className="detail-item">
              <strong>الحالة : </strong>
              <span className={`status ${completed ? 'completed' : 'not-completed'}`}>{completed ? 'تم الاتمام' : 'لم يتم الاتمام'}</span>
            </div>
          </div>
          <Link to={completed ? `/quizzes/results/${quizId}` : `/quizzes/quizSession/${quizId}`}>
            {completed ? 'اظهر النتائج': ' ابدأ الامتحان'}
          </Link>
        </div>
      </div>
    </>
  );
}
