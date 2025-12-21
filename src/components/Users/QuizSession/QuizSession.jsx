import './QuizSession.css';
import Loading from '../../Loading/Loading';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';
import MathRender from '../../MathRender/MathRender';

export default function QuizSession() {
    const { quiz: quizId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [quizData, setQuizData] = useState({});
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuizData = async () => {
            await axios.get(`/quizzes/${quizId}`).then((response) => {
                    if (response.data.completed) {
                        navigate(`/quizzes/results/${quizId}`);
                        return;
                    }
                    setQuizData(response.data.quiz);
                    setQuestions(response.data.quiz.quiz_questions || []);
                }).finally(() => {
                    setIsLoading(false);
                })
        };

        fetchQuizData();
    }, [quizId]);

    function handleAnswerSelect(questionId, answerId){
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    }

    function handleSubmit(){
        if (Object.keys(selectedAnswers).length == questions.length) {
            setIsSubmitting(true);
        }
    }

    async function handleSubmitConfirm(){
        axios.post('/submissions',{
            quiz_id: quizId,
            answers: selectedAnswers
        })
        .then(() =>{
            navigate(`/quizzes/results/${quizId}`);
        }).catch(error => {
            if (error.response?.data?.errors) {
                const formattedErrors = {};
                Object.entries(error.response.data.errors).forEach(([key, value]) => {
                    formattedErrors[key] = value[0]; 
                });
                setErrors(formattedErrors);
            }
        }).finally(()=>{
            setIsSubmitting(false)
        })
    }

    function handleSubmitCancel(){
        setIsSubmitting(false);
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
        <div className="quiz-session">
            <div className="quiz-header">
                <h1 className="quiz-title">{quizData.quiz_title}</h1>
                <p className="quiz-description">{quizData.quiz_description}</p>
            </div>

            <div className="quiz-questions">
                {questions.map((question, index) => (
                    <div key={question.quiz_question_id} className="question-card">
                        <div className="question-header">
                            <span className="question-number">السؤال {index + 1}</span>
                            <h3 className="question-text">
                                <MathRender content={question.question_description || ''} />
                            </h3>
                        </div>

                        {question.question_image && (
                            <div className="question-image">
                                <img 
                                    src={question.question_image} 
                                    alt={`السؤال البصري ${index + 1}`}
                                />
                            </div>
                        )}

                        <div className="answers-list">
                            {question.question_answers?.map((answer,answerIndex) => (
                                <div
                                    key={answer.question_answer_id}
                                    className={`answer ${selectedAnswers[question.quiz_question_id] === answer.question_answer_id ? 'selected' : ''}`}
                                    onClick={() => handleAnswerSelect(question.quiz_question_id, answer.question_answer_id)}
                                >
                                    <span className="answer-letter">
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

                <div className="submit-container">
                    <button className="submit-quiz-button" onClick={handleSubmit}>
                        تسليم الإجابات
                    </button>
                    {errors['answers'] && <p className='error'>الرجاء الإجابة على جميع الأسئلة قبل التسليم!</p>}
                </div>
            </div>
        </div>
        <ConfirmationModal
            isOpen={isSubmitting}
            onClose={handleSubmitCancel}
            onConfirm={handleSubmitConfirm}
            message="هل أنت متأكد أنك تريد تسليم الامتحان؟"
        />
        </>
    );
}