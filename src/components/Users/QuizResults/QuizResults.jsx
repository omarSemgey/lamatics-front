import './QuizResults.css';
import Loading from '../../Loading/Loading';
import { useEffect,  useState } from 'react';
import {  useParams } from 'react-router-dom';
import axios from 'axios';
import MathRender from '../../MathRender/MathRender';

export default function QuizResults (){
    const id = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [quiz,setQuiz] = useState({});
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchQuizData = async () => {
            await axios.get(`/submissions/${id.quiz}`)  
            .then((response) => {

                setQuiz(response.data.submission.quiz);

                setUserAnswers(response.data.submission.answers)

                setQuestions(response.data.submission.quiz.quiz_questions || []);

                setScore(response.data.submission.score)

                setIsLoading(false);
            });
        };

        fetchQuizData();
    }, [id]);

    if (isLoading) {
        return <Loading></Loading>;
    }

    function handleAnswer(answer){
        const isUserAnswer = userAnswers[answer.question_id] === answer.question_answer_id;
        const isCorrect = answer.correct_answer == 1 ? true : false;

        switch (true) {
            case isUserAnswer && isCorrect:
                return 'user-correct';
            case isUserAnswer && !isCorrect:
                return 'user-incorrect';
            case isCorrect:
                return 'correct';
            default:
                return '';
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

    return (
        <>
        <div className="user-results-show">
            <div className="quiz-header">
                <h1 className="quiz-title">{quiz.quiz_title}</h1>
                <p className="quiz-description">{quiz.quiz_description}</p>
                <p className='user-score'><span className={`score ${handleScoreClass(score)}`}>Your score : {score}%</span></p>
            </div>

            <div className="quiz-questions">
                {questions?.map((question, index) => (
                    <div key={question.quiz_question_id} className="question-card">
                        <div className="question-header">
                            <span className="question-number">Question {index + 1}</span>
                            <h3 className="question-text">
                                <MathRender content={question.question_description || ''} />
                            </h3>
                        </div>

                        {question.question_image && (
                            <div className="question-image">
                                <img src={question.question_image} alt={`Visual for question ${index + 1}`} />
                            </div>
                        )}

                        <div className="answers-list">
                            {question.question_answers?.map((answer, answerIndex) => (
                                <div key={answer.question_answer_id} className="answer">
                                    <span className={`answer-letter ${handleAnswer(answer)}`}>
                                        {String.fromCharCode(65 + answerIndex)}
                                    </span>
                                    <div className="answer-text">
                                        <MathRender content={answer.question_answer_text || ''} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}