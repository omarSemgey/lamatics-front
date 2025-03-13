import './ShowQuiz.css'
import Loading from '../../../Loading/Loading';
import { useEffect,  useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MathRender from '../../../MathRender/MathRender';

export default function ShowQuiz(){
    const id = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [quiz,setQuiz] = useState({});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuizData = async () => {
            await axios.get(`/quizzes/${id.quiz}`)  
            .then((response) => {
                setQuiz(response.data.quiz);

                setQuestions(response.data.quiz.quiz_questions || []);

                setIsLoading(false);
            });
        };

        fetchQuizData();
    }, [id]);

    if (isLoading) {
        return <Loading></Loading>;
    }

    return (
        <>
        <div className="quiz-show">
            <div className="quiz-header">
                <h1 className="quiz-title">{quiz.quiz_title}</h1>
                <p className="quiz-description">{quiz.quiz_description}</p>
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
                                    <span className={`answer-letter ${answer.correct_answer ? 'correct' : ''}`}>
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